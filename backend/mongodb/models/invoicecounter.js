import mongoose from "mongoose";

const InvoiceCounterSchema = new mongoose.Schema({
        prefix: {type: String, required: true, unique: true},
        seq: {type: Number, default: 0},
    },
    {timestamps: true} // adds createdAt, updatedAt
);

const invoiceCounterModel = mongoose.model("InvoiceCounter", InvoiceCounterSchema);

export default invoiceCounterModel;