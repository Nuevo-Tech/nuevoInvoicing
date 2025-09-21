import express from "express";
import mongoose from "mongoose";
import Invoice from "../mongodb/models/invoice.js";
import {handleRequest, api} from "./zatcaApis.js"; // your API helper

const router = express.Router();
const ZATCA_API_BASE_URL = process.env.ZATCA_BACKEND_BASE_URL;

const ALLOWED_STATUSES = ["Validated W", "Validated"];

router.post("/", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const invoicesArray = req.body.invoices || [];

        if (!Array.isArray(invoicesArray) || invoicesArray.length === 0) {
            return res.status(400).json({message: "No invoices provided"});
        }

        const invoicesWithInfo = [];
        const invalidInvoices = [];

        // Step 1: Validate invoices & build request for ZATCA
        for (const {invoiceId} of invoicesArray) {
            const invoiceDoc = await Invoice.findOne({id: invoiceId}).session(session).lean();

            if (!invoiceDoc) {
                invalidInvoices.push({invoiceId, error: "Invoice not found"});
                continue;
            }

            if (!ALLOWED_STATUSES.includes(invoiceDoc.status)) {
                invalidInvoices.push({
                    invoiceId,
                    error: "Invoice status not allowed for compliance check",
                });
                continue;
            }

            invoicesWithInfo.push({
                invoiceId,
                invoiceType: invoiceDoc.invoice_type || "StandardInvoice",
            });
        }

        if (invoicesWithInfo.length === 0) {
            await session.abortTransaction();
            return res.status(200).json({invalidInvoices, message: "No valid invoices to process"});
        }

        // Step 2: Send to ZATCA backend
        const requestBody = {
            acceptLanguage: "EN",
            egsClientName: "Syncshire",
            invoices: invoicesWithInfo,
        };

        console.log("📥 Request body being sent:", requestBody);

        const response = await handleRequest(api.post(ZATCA_API_BASE_URL + "/reportInvoice", requestBody));
        const responseData = Array.isArray(response?.zatcaData) ? response.zatcaData : [];

        console.log("📥 ZATCA response:", responseData);

        // Step 3: Update invoices atomically
        for (const resItem of responseData) {
            const invoice = await Invoice.findOne({id: resItem.invoiceId}).session(session);
            if (!invoice) continue;

            const clearance = resItem.clearanceStatus || null;
            const reporting = resItem.reportingStatus || null;

            const errors = resItem.zatcaErrorMessages || [];
            const warnings = resItem.zatcaWarningMessages || [];

            if (invoice.invoice_type.includes("Standard")) {
                if (clearance === "CLEARED" && errors.length === 0 && warnings.length === 0) {
                    invoice.status = "ZatcaReported";
                } else if (clearance === "CLEARED" && errors.length === 0 && warnings.length > 0) {
                    invoice.status = "ZatcaReported W";
                } else {
                    invoice.status = "ValidationFailed";
                }
            } else if(invoice.invoice_type.includes("Simplified")){
                if (reporting === "REPORTED" && errors.length === 0 && warnings.length === 0) {
                    invoice.status = "Validated";
                } else if (reporting === "REPORTED" && errors.length === 0 && warnings.length > 0) {
                    invoice.status = "Validated W";
                }
                else {
                    invoice.status = "ZatcaReportingFailed";
                }
            }

            invoice.zatcaErrorMessages = errors;
            invoice.zatcaWarningMessages = warnings;

            await invoice.save({session});
        }

        await session.commitTransaction();

        // Step 4: Send response to frontend
        return res.status(200).json({
            processedInvoices: responseData,
            invalidInvoices,
            message: "Zatca Reporting completed successfully",
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Zatca Reporting  failed:", error);
        return res.status(500).json({message: "Zatca Reporting  failed", error: error.message});
    } finally {
        session.endSession();
    }
});

export default router;
