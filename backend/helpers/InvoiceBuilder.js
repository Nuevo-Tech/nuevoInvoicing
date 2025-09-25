import fs from "fs";
import path from "path";
import Helper from "../helpers/Helper.js";
import {generateInvoiceId} from "../helpers/DBQueryHelper.js";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, "zatcaInvoiceTemplate.json");

const baseTemplate = JSON.parse(fs.readFileSync(templatePath, "utf-8"));
const taxScheme = "VAT";


class InvoiceBuilder {
    constructor() {
        // Deep clone so we don’t modify the original template
        this.invoice = JSON.parse(JSON.stringify(baseTemplate));
    }

    setField(fieldPath, value) {
        // Example: setField("invoiceTypeCode.value", "388")
        const keys = fieldPath.split(".");
        let obj = this.invoice;
        while (keys.length > 1) {
            const key = keys.shift();
            obj = obj[key] = obj[key] || {};
        }
        obj[keys[0]] = value;
    }

    bulkSet(fields) {
        // fields = { id: "SME001", uuid: "abc", "invoiceTypeCode.value": "388" }
        Object.entries(fields).forEach(([key, value]) => {
            this.setField(key, value);
        });
    }

    build() {
        return this.invoice;
    }

    async createInvoiceFromRequest(reqBody, flag, Client, MyOrgProfile, session) {
        if (flag === "new") {
            const customInvoiceId = await generateInvoiceId(Client, session);
            this.setField("id", customInvoiceId);
            this.setField("uuid", Helper.generateUUID());
        } else {
            this.setField("id", reqBody.invoice_id);
            this.setField("uuid", reqBody.uuid);
        }

        let typeCodeOfInvoice = Helper.getZatcaInvoiceType(reqBody.invoice_type);

        const totalTaxAmount = reqBody.subtotal * (reqBody.tax_percentage / 100);

        const allowanceCharges = [];
        let allowanceCharge = null;
        // Discount
        if (reqBody.total_discount_amount >= 0) {
            allowanceCharge = {
                chargeIndicator: false,
                allowanceChargeReason: "discount",
                amount: {
                    value: Helper.roundHalfUp(reqBody.total_discount_amount, 2),
                    currencyId: reqBody.currency || "SAR",
                },
                taxCategory: {
                    id: reqBody.tax_category,
                    percent: reqBody.tax_percentage.toString(),
                    taxScheme: {id: taxScheme},
                }
            }
        }


        // Surcharge
        // if (reqBody.total_surcharge_amount > 0) {
        //     allowanceCharges.push({
        //         chargeIndicator: true,
        //         allowanceChargeReason: "surcharge",
        //         amount: {
        //             value: Helper.toTwoDecimalsString(reqBody.total_surcharge_amount),
        //             currencyId: reqBody.currency || reqBody.currency || "SAR",
        //         },
        //         taxCategory: {
        //             id: reqBody.tax_category,
        //             percent: reqBody.tax_percentage,
        //             taxScheme: {id: taxScheme},
        //         },
        //     });
        // }

        //tax total
        const taxTotal = [
            {
                taxAmount: {
                    value: Helper.roundHalfUp(totalTaxAmount,2), // e.g. "0.6"
                    currencyId: reqBody.currency || "SAR",
                },
            },
            {
                taxAmount: {
                    value: Helper.roundHalfUp(totalTaxAmount,2), // e.g. "0.6"
                    currencyId: reqBody.currency || "SAR",
                },
                taxSubtotal: {
                    taxableAmount: {
                        value: Helper.roundHalfUp(reqBody.subtotal, 2), // e.g. "4.00"
                        currencyId: reqBody.currency || "SAR",
                    },
                    taxAmount: {
                        value: Helper.roundHalfUp(totalTaxAmount, 2), // e.g. "0.60"
                        currencyId: reqBody.currency || "SAR",
                    },
                    taxCategory: {
                        id: reqBody.tax_category, // e.g. "S"
                        percent: reqBody.tax_percentage.toFixed(2), // e.g. "15.00"
                        taxScheme: {
                            id: taxScheme,
                        },
                    },
                },
            },
        ];

        //items
        const services = reqBody.services || [];

        // ✅ total without discount
        const totalWithoutDiscount = services.reduce((sum, service) => {
            return sum + (service.price_without_discount);
        }, 0);

        // ✅ total without discount
        const subtotal = Number(reqBody.subtotal || 0);
        const totalDiscount = Number(reqBody.total_discount_amount || 0);
        const totalSurcharge = Number(reqBody.total_surcharge_amount || 0);

        const totalAfterDiscountAndSurcharge = totalWithoutDiscount - totalDiscount + totalSurcharge;

        // Build legalMonetaryTotal
        const legalMonetaryTotal = {
            lineExtensionAmount: {
                value:  Helper.roundHalfUp(totalWithoutDiscount, 2),   // e.g. "4.00"
                currencyId: reqBody.currency || "SAR",
            },
            taxExclusiveAmount: {
                value: Helper.roundHalfUp(totalAfterDiscountAndSurcharge, 2),   // e.g. "4.00"
                currencyId: reqBody.currency || "SAR",
            },
            taxInclusiveAmount: {
                value: Helper.roundHalfUp(reqBody.total, 2),   // e.g. "4.60"
                currencyId: reqBody.currency || "SAR",
            },
            allowanceTotalAmount: {
                value: Helper.roundHalfUp(reqBody.total_discount_amount, 2) || "0.00",
                currencyId: reqBody.currency || "SAR",
            },
            prepaidAmount: {
                value: Helper.roundHalfUp(reqBody.prepaid_amount, 2) || "0.00",
                currencyId: reqBody.currency || "SAR",
            },
            payableAmount: {
                value: Helper.roundHalfUp(reqBody.total, 2),         // e.g. "4.60"
                currencyId: reqBody.currency || reqBody.currency || "SAR",
            },
        };

        //invoicelines
        const invoiceLines = Helper.buildInvoiceLines(services, reqBody.currency, reqBody.tax_category, reqBody.tax_percentage, taxScheme);
        const supplierDetails = Helper.buildAccountingSupplierParty(MyOrgProfile);
        const customerDetails = Helper.buildAccountingCustomerParty(Client);

        this.bulkSet({
            //id uuid are set above
            issueDate: Helper.formatDateToZatca(reqBody.invoiceDate),
            issueTime: Helper.getTimeNowZatca(),
            "invoiceTypeCode": typeCodeOfInvoice,
            accountingSupplierParty: supplierDetails,
            accountingCustomerParty: customerDetails,
            "delivery.actualDeliveryDate": Helper.formatDateToZatca(reqBody.deliveryDate),
            "paymentMeans.paymentMeansCode": reqBody.payment_means,
            allowanceCharge: allowanceCharge,
            taxTotal: taxTotal,
            legalMonetaryTotal: legalMonetaryTotal,
            invoiceLine: invoiceLines
        });
        return this.build();
    }
}

export default InvoiceBuilder;
