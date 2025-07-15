// models/order.model.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [
    {
      id: String,
      name_en: String,
      name_ta: String,
      price: Number,
      quantity: Number,
      category: String,
      image_url: String,
    },
  ],
  total: { type: Number, required: true },
  customerDetails: {
    fullName: String,
    mobile: String,
    email: String,
    address: String,
    pincode: String,
  },
  status: { type: String, default: "confirmed" },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model('Order', orderSchema);
