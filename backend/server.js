// server.js (ESM version)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Multer + Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
});
const upload = multer({ storage });

// ✅ Dynamic product schema/model generator
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

// ✅ POST: Add product to dynamic collection
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

// ✅ GET: Fetch products from a category collection
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

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
