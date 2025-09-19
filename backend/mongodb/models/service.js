import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  unitCode: { type: String, required: true, default:"PCE" },
  discount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const serviceModel = mongoose.model("Service", ServiceSchema);

export default serviceModel;
