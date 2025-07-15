// ✅ Fixed Backend + Updated Track Order + Update Status + Fetch Orders with Date and Partial OrderId Filters

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { Order } from './models/order.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const invoiceDir = path.join(__dirname, 'invoices');
if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);
app.use('/invoices', express.static(invoiceDir));

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
});
const upload = multer({ storage });

const modelCache = {};
const productSchema = new mongoose.Schema({
  name_en: String,
  name_ta: String,
  price: Number,
  imageUrl: String,
}, { timestamps: true });

function getProductModelByCategory(category) {
  const modelName = category.replace(/\s+/g, '_').toUpperCase();
  if (!modelCache[modelName]) {
    modelCache[modelName] = mongoose.model(modelName, productSchema, modelName);
  }
  return modelCache[modelName];
}

// ✅ GET: Track Order
app.get('/api/orders/track', async (req, res) => {
  try {
    const { orderId, mobile } = req.query;
    if (!orderId || !mobile) {
      return res.status(400).json({ error: 'Missing orderId or mobile number' });
    }
    const order = await Order.findOne({
      orderId: String(orderId),
      'customerDetails.mobile': String(mobile)
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('❌ Error tracking order:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// ✅ GET: All Orders
app.get('/api/orders', async (req, res) => {
  try {
    const { date, orderId } = req.query;
    const query = {};
    if (orderId) query.orderId = { $regex: orderId, $options: 'i' };
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

function generateInvoice(order, filePath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(20).text('KM Crackers Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: ${order.orderId}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Name: ${order.customerDetails.fullName}`);
  doc.text(`Email: ${order.customerDetails.email}`);
  doc.text(`Mobile: ${order.customerDetails.mobile}`);
  doc.text(`Address: ${order.customerDetails.address}`);
  doc.text(`Pincode: ${order.customerDetails.pincode}`);
  doc.moveDown();
  doc.text('Products:', { underline: true });
  order.items.forEach((item, idx) => {
    doc.text(`${idx + 1}. ${item.name_en} (${item.name_ta}) × ${item.quantity} - ₹${item.price * item.quantity}`);
  });
  doc.moveDown();
  doc.font('Helvetica-Bold').text(`Total Amount: ₹${order.total}`, { align: 'right' });
  doc.end();
}

async function sendEmailWithInvoice(to, filePath) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: `"KM Crackers" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'KM Crackers - Your Order Invoice',
    text: 'Thank you for your order! Please find your invoice attached.',
    attachments: [{ filename: 'invoice.pdf', path: filePath }],
  });
}

// ✅ DELETE: Cancel Order
app.delete('/api/orders/cancel/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Order.findOneAndDelete({ orderId });
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.status(200).json({ message: '✅ Order cancelled successfully', orderId });
  } catch (error) {
    console.error('❌ Order cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// ✅ POST: Add Product
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name_en, name_ta, price, category } = req.body;
    const imageUrl = req.file?.path;
    if (!name_en || !name_ta || !price || !category || !imageUrl) {
      return res.status(400).json({ error: 'All fields including image and category are required.' });
    }
    const ProductModel = getProductModelByCategory(category);
    const newProduct = new ProductModel({ name_en, name_ta, price, imageUrl });
    await newProduct.save();
    res.status(201).json({ message: '✅ Product added successfully', product: newProduct });
  } catch (error) {
    console.error('❌ Product POST error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// ✅ POST: Place Order
app.post('/api/orders/place', async (req, res) => {
  try {
    const { orderId, items, total, customerDetails, status, createdAt } = req.body;
    if (!orderId || !items || !total || !customerDetails) {
      return res.status(400).json({ error: 'Missing required order fields.' });
    }
    const newOrder = new Order({
      orderId,
      items,
      total,
      customerDetails,
      status: status || 'confirmed',
      createdAt: createdAt || new Date().toISOString(),
    });
    await newOrder.save();
    const invoicePath = path.join(invoiceDir, `${orderId}.pdf`);
    generateInvoice(newOrder, invoicePath);
    await sendEmailWithInvoice(customerDetails.email, invoicePath);
    fs.unlinkSync(invoicePath);
    res.status(201).json({ message: '✅ Order placed & invoice emailed', orderId });
  } catch (error) {
    console.error('❌ Order placement error:', error);
    res.status(500).json({ error: 'Failed to place order or send invoice' });
  }
});

// ✅ Admin Login Route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({ success: true, token: "admin-auth-token" });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// ✅ GET: Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      let itemTotal = 0;
      if (Array.isArray(order.items)) {
        itemTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      }
      return sum + itemTotal;
    }, 0);
    res.json({ totalOrders, totalRevenue });
  } catch (error) {
    console.error("❌ Analytics fetch error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// ✅ PATCH: Update Order Status
app.patch('/api/orders/update-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.json({ message: "✅ Status updated successfully", order });
  } catch (error) {
    console.error("❌ Status update error:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// ✅ GET: Products by Category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const ProductModel = getProductModelByCategory(category);
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching category products:', error);
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
