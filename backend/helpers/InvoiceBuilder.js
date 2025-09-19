const fs = require("fs");
const path = require("path");
const Helper = require("./Helper.js");
const DBQueryHelper = require("./DBQueryHelper.js");

const templatePath = path.join(__dirname, "zatcaInvoiceTemplate.json");
const baseTemplate = JSON.parse(fs.readFileSync(templatePath, "utf-8"));

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

    async createInvoiceFromRequest(reqBody, flag) {
        if(flag === "new"){
            const customInvoiceId = await DBQueryHelper.generateInvoiceId(
                reqBody.client.partyLegalEntityRegistrationName
            );
            this.setField("id", customInvoiceId);
            this.setField("uuid", Helper.generateUUID());
        }

        let typeCodeOfInvoice = Helper.getZatcaInvoiceType(reqBody.invoice_type_code_value);

        let chargeIndicator = false;
        let allowanceChargeReason = "discount";
        let allowanceChargeAmount = 0;
        if(reqBody.surcharge > 0){
            chargeIndicator=t

        }


        this.bulkSet({
            issueDate: Helper.formatDateToZatca(reqBody.invoiceDate),
            issueTime: Helper.getTimeNowZatca(),
            "invoiceTypeCode": typeCodeOfInvoice,
            "paymentMeans.paymentMeansCode": reqBody.payment_means,
            "allowanceCharge.taxCategory.id": reqBody.tax_category,
            "allowanceCharge.taxCategory.percentage": reqBody.tax,
            "allowanceCharge.taxCategory.taxScheme.id": "VAT",
            "allowanceCharge.amount.value": reqBody.allowance_charge_amount_value,
        });

        return this.build();
    }
}

module.exports = InvoiceBuilder;
