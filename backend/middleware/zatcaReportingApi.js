import express from "express";
import Invoice from "../mongodb/models/invoice.js";
import { handleRequest, api } from "./zatcaApis.js"; // your API helper

const router = express.Router();
const ZATCA_API_BASE_URL = process.env.ZATCA_BACKEND_BASE_URL;

const ALLOWED_STATUSES = ["Validated W", "Validated"];

router.post("/", async (req, res) => {
    try {
        const invoicesArray = req.body.invoices || [];

        if (!Array.isArray(invoicesArray) || invoicesArray.length === 0) {
            return res.status(400).json({ message: "No invoices provided" });
        }

        const invoicesWithInfo = [];
        const invalidInvoices = [];

        // Step 1: Validate invoices & build request for ZATCA
        for (const { invoiceId } of invoicesArray) {
            const invoiceDoc = await Invoice.findOne({ id: invoiceId });

            if (!invoiceDoc) {
                invalidInvoices.push({ invoiceId, error: "Invoice not found" });
                continue;
            }

            if (!ALLOWED_STATUSES.includes(invoiceDoc.status)) {
                invalidInvoices.push({
                    invoiceId,
                    error: "Invoice status not allowed to be repotable to zatca",
                });
                continue;
            }

            invoicesWithInfo.push({
                invoiceId,
                invoiceType: invoiceDoc.invoice_type || "",
            });
        }

        if (invoicesWithInfo.length === 0) {
            return res.status(200).json({ invalidInvoices, message: "No valid invoices to process" });
        }

        // Step 2: Send to ZATCA backend
        const requestBody = {
            acceptLanguage: "EN",
            egsClientName: "Syncshire",
            invoices: invoicesWithInfo,
        };

        console.log("📥 Request body being sent:", requestBody);

        const response = await handleRequest(
            api.post(ZATCA_API_BASE_URL + "/reportInvoice", requestBody)
        );
        const responseData = Array.isArray(response?.zatcaData) ? response.zatcaData : [];

        console.log("📥 ZATCA response:", responseData);

        // Step 3: Update invoices one by one, but don’t break on error
        const results = [];
        const failedUpdates = [];

        for (const resItem of responseData) {
            try {
                const clearance = resItem.clearanceStatus || null;
                const reporting = resItem.reportingStatus || null;
                const errors = (resItem.zatcaErrorMessages || []).map(e => JSON.stringify(e));
                const warnings = (resItem.zatcaWarningMessages || []).map(w => JSON.stringify(w));

                let status = "ValidationFailed";

                if (resItem.invoiceType?.includes("Standard")) {
                    if (clearance === "CLEARED" && errors.length === 0 && warnings.length === 0) {
                        status = "ZatcaReported";
                    } else if (clearance === "CLEARED" && errors.length === 0 && warnings.length > 0) {
                        status = "ZatcaReported W";
                    } else {
                        status = "ZatcaReportingFailed";
                    }
                } else if (resItem.invoiceType?.includes("Simplified")) {
                    if (reporting === "REPORTED" && errors.length === 0 && warnings.length === 0) {
                        status = "Validated";
                    } else if (reporting === "REPORTED" && errors.length === 0 && warnings.length > 0) {
                        status = "ZatcaReported W";
                    } else {
                        status = "ZatcaReportingFailed";
                    }
                }

                const updateResult = await Invoice.updateOne(
                    { id: resItem.invoiceId }, // adjust if schema uses _id
                    {
                        $set: {
                            zatca_response: resItem,
                            status,
                            zatcaErrorMessages: errors,
                            zatcaWarningMessages: warnings,
                        },
                    }
                );

                results.push({
                    invoiceId: resItem.invoiceId,
                    success: true,
                    modifiedCount: updateResult.modifiedCount,
                });
            } catch (err) {
                console.error(`❌ Failed to update invoice ${resItem.invoiceId}:`, err.message);

                failedUpdates.push({
                    invoiceId: resItem.invoiceId,
                    success: false,
                    error: err.message,
                });
            }
        }

        // ✅ Step 4: Send final response after loop finishes
        return res.status(200).json({
            processedInvoices: results,
            failedInvoices: failedUpdates,
            invalidInvoices,
            message: "Zatca Reporting completed (with partial successes/failures)",
        });
    } catch (error) {
        console.error("Zatca Reporting failed:", error);
        return res.status(500).json({ message: "Zatca Reporting failed", error: error.message });
    }
});

export default router;
