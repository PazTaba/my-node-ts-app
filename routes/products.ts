import express from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../models/Product';
import User from '../models/User';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/'),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.random().toString().slice(2)}${ext}`);
    }
});
const upload = multer({ storage });

// GET all products
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        console.log('📥 GET /products - Query Params:', req.query);

        const filter: any = {};
        if (category && category !== 'all') filter.category = category;
        if (search) filter.name = { $regex: search as string, $options: 'i' };

        const products = await Product.find(filter).sort({ createdAt: -1 });
        console.log(`📤 Returning ${products.length} products`);
        res.json(products);
    } catch (error) {
        console.error('❌ Error loading products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET single product by ID
router.get('/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params;
        console.log('📥 GET /products/:id - ID:', id);

        const product = await Product.findById(id).populate('userId', 'name image phone');
        if (!product) {
            console.warn(`⚠️ Product with ID ${id} not found`);
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log(`📤 Returning product: ${product.name}`);
        res.json(product);
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new product
router.post('/add', upload.single('image'), async (req: any, res: any) => {
    try {
        console.log('📥 POST /products/add');
        console.log('📝 Body:', req.body);
        console.log('🖼️ Uploaded file:', req.file);

        const {
            name,
            price,
            distance,
            userId,
            category,
            latitude,
            longitude,
            description,
            condition,
            address
        } = req.body;

        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        // Validate required fields
        if (!name || !price || !distance || !userId || !image || !category || !latitude || !longitude || !description || !condition || !address) {
            console.warn('⚠️ Missing fields in request');
            return res.status(400).json({ message: 'Missing fields' });
        }

        const newProduct = new Product({
            name,
            description,
            condition,
            address,
            price: Number(price),
            distance: Number(distance),
            latitude: Number(latitude),
            longitude: Number(longitude),
            image,
            category,
            userId,
            createdAt: new Date()
        });

        await newProduct.save();
        await User.findByIdAndUpdate(userId, { $push: { products: newProduct._id } });

        console.log(`✅ Product saved: ${newProduct.name} (${newProduct._id})`);
        res.status(201).json({ message: 'Product saved', product: newProduct });
    } catch (error) {
        console.error('❌ Error saving product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
