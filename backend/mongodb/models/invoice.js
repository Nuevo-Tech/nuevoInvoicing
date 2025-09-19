import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
        id: {type: String, required: true, unique: true},
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
        },
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
        },
        services: [{type: mongoose.Schema.Types.ObjectId, ref: "Service"}],
        creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        status: {type: String, required: true},
        invoice_name: {type: String, required: true},
        invoiceDate: {type: String, required: true}, // can be Date if you want
        deliveryDate: {type: String},
        invoice_type: {type: String, required: true},
        currency: {type: String, required: true},
        tax_category: {type: String},
        tax_scheme_id: {type: String},
        payment_means: {type: String},
        note: {type: String},

        invoice_id: {type: String, unique: true, required: true},
        uuid: {type: String, required: true},
        invoice_type_code_value: {type: String},
        invoice_type_code_name: {type: String},
        allowance_charge_indicator: {type: Boolean, default: false},
        allowance_charge_reason: {type: String},
        allowance_charge_amount_value: {type: String},

        zatca_qr_code: {type: String},
        discount_percentage: {type: Number, default: 0},
        total_discount_amount: {type: Number, default: 0},
        surcharge: {type: Number, default: 0},
        tax_percentage: {type: Number, default: 0},
        total_tax_amount: {type: Number, default: 0},
        custom_id: {type: String},
        subtotal: {type: Number, required: true},
        total: {type: Number, required: true},
    },
    {timestamps: true} // adds createdAt, updatedAt
);

const invoiceModel = mongoose.model("Invoice", InvoiceSchema);

export default invoiceModel;
