// routes/categories.ts
import express from 'express';
import Category from '../models/Category';
const router = express.Router();


router.post('/', async (req, res) => {
    try {
      const { id, name, icon, color } = req.body;
      const newCategory = await Category.create({ id, name, icon, color });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: 'שגיאה ביצירת קטגוריה' });
    }
  });
  
  router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
  });
  
export default router;
