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
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import apicache from 'apicache';
import twilio from 'twilio'; // <-- Add this line


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
app.use(compression());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(cors());
app.use(express.json());
const cache = apicache.middleware;

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
// Remove static serving of invoices. Use custom endpoint below.

// Custom endpoint: Serve and delete invoice after download
app.get('/invoices/:filename', (req, res) => {
  const filePath = path.join(invoiceDir, req.params.filename);
  res.download(filePath, (err) => {
    if (!err) {
      // Delete the file after successful download
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting invoice:', unlinkErr);
      });
    }
  });
});

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
  original_price: Number, // Add this field
  imageUrl: String,
  youtube_url: String, // Add this field
  category: String,    // Add this field for completeness
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
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc
    .fontSize(24)
    .fillColor('#d97706')
    .text(' KM Crackers Invoice', { align: 'center', underline: true });
  doc.moveDown(1.5);

  // Draw main box
  const boxTop = doc.y;
  const boxLeft = 40;
  const boxWidth = 520;
  let boxHeight = 320 + (order.items.length * 20);

  // Draw rectangle (box)
  doc
    .lineWidth(1.5)
    .roundedRect(boxLeft, boxTop, boxWidth, boxHeight, 12)
    .stroke('#d97706');

  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#222');
  const startY = doc.y + 10;
  doc.text(`Order ID: ${order.orderId}`, boxLeft + 16, startY);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, boxLeft + 280, startY);
  doc.moveDown(1);
  doc.text(`Name: ${order.customerDetails.fullName}`, boxLeft + 16);
  doc.text(`Email: ${order.customerDetails.email}`, boxLeft + 280);
  doc.text(`Mobile: ${order.customerDetails.mobile}`, boxLeft + 16);
  doc.text(`Pincode: ${order.customerDetails.pincode}`, boxLeft + 280);
  doc.text(`Address: ${order.customerDetails.address}`, boxLeft + 16, doc.y, { width: boxWidth - 32 });
  doc.moveDown(1);

  // Products Table Header
  doc.font('Helvetica-Bold').fontSize(13).fillColor('#d97706');
  doc.text('Products', boxLeft + 16, doc.y);
  doc.font('Helvetica').fontSize(12).fillColor('#222');

  // Table columns
  doc.text('No.', boxLeft + 16, doc.y, { continued: true });
  doc.text('Name', boxLeft + 50, doc.y, { continued: true });
  doc.text('Qty', boxLeft + 220, doc.y, { continued: true });
  doc.text('Price', boxLeft + 270, doc.y, { continued: true });
  doc.text('Total', boxLeft + 300, doc.y);

  // Products Table Rows
  order.items.forEach((item, idx) => {
    doc.text(`${idx + 1}`, boxLeft + 16, doc.y, { continued: true });
    doc.text(`${item.name_en} (${item.name_ta})`, boxLeft + 50, doc.y, { continued: true });
    doc.text(`${item.quantity}`, boxLeft + 220, doc.y, { continued: true });
    doc.text(`₹${item.price}`, boxLeft + 270, doc.y, { continued: true });
    doc.text(`₹${item.price * item.quantity}`, boxLeft + 300, doc.y);
  });
  doc.moveDown(1);

  // Payment, Status, Total
  doc.font('Helvetica-Bold').fontSize(13).fillColor('#222');
 
  doc.text(`Order Status: ${order.status || 'confirmed'}`, boxLeft + 16, doc.y);
  doc.fontSize(15).fillColor('#d97706').text(`Total Amount: ₹${order.total}`, boxLeft + 180, doc.y);

  // Thank you note
  doc.moveDown(2);
  doc.fontSize(13).fillColor('#16a34a').text('Thank you for shopping with KM Crackers! Wishing you a safe and sparkling festival!', { align: 'center' });

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
    let { name_en, name_ta, price, original_price, category, youtube_url } = req.body;
    const imageUrl = req.file?.path;
    if (!name_en || !name_ta || !price || !category || !imageUrl) {
      return res.status(400).json({ error: 'All fields including image and category are required.' });
    }
    // Ensure price and original_price are numbers
    price = Number(price);
    original_price = original_price ? Number(original_price) : undefined;
    const ProductModel = getProductModelByCategory(category);
    const newProduct = new ProductModel({ name_en, name_ta, price, original_price, imageUrl, youtube_url });
    await newProduct.save();
    res.status(201).json({ message: '✅ Product added successfully', product: newProduct });
  } catch (error) {
    console.error('❌ Product POST error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendOrderToWhatsApp(order) {
  const to = process.env.OWNER_WHATSAPP_TO;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const items = order.items.map(
    (item, i) => `${i + 1}. ${item.name_en} (${item.name_ta}) x${item.quantity} - ₹${item.price * item.quantity}`
  ).join('\n');
  const message =
    `🧨 *New Order Placed!*\n` +
    `Order ID: ${order.orderId}\n` +
    `Name: ${order.customerDetails.fullName}\n` +
    `Mobile: ${order.customerDetails.mobile}\n` +
    `Address: ${order.customerDetails.address}, ${order.customerDetails.pincode}\n` +
    `Items:\n${items}\n` +
    `Total: ₹${order.total}\n` +
    `Status: ${order.status || 'confirmed'}`;

  if (to && from) {
    await twilioClient.messages.create({
      from,
      to,
      body: message,
    });
  }
}

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
    // fs.unlinkSync(invoicePath); // Do not delete immediately so frontend can download
    // Send WhatsApp message to owner
    await sendOrderToWhatsApp(newOrder);
    res.status(201).json({ message: '✅ Order placed & invoice emailed', orderId });
  } catch (error) {
    console.error('❌ Order placement error:', error);
    res.status(500).json({ error: 'Failed to place order or send notifications' });
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
app.get('/api/analytics', cache('2 minutes'), async (req, res) => {
  try {
    const { date } = req.query;
    let orders;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      orders = await Order.find({ createdAt: { $gte: start, $lte: end } });
    } else {
      orders = await Order.find({});
    }
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
app.get('/api/products/category/:category', cache('2 minutes'), async (req, res) => {
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

// ✅ DELETE: Delete Product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Search all category collections for the product
    const collections = await mongoose.connection.db.listCollections().toArray();
    let deleted = false;
    for (const col of collections) {
      const modelName = col.name;
      // Only check collections that match the category naming pattern
      if (/^[A-Z0-9_]+$/.test(modelName)) {
        const Model = mongoose.model(modelName, productSchema, modelName);
        const result = await Model.findByIdAndDelete(id);
        if (result) {
          deleted = true;
          break;
        }
      }
    }
    if (deleted) {
      res.status(200).json({ message: '✅ Product deleted successfully', id });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('❌ Product DELETE error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
