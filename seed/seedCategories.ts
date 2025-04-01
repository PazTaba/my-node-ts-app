// seed/seedCategories.ts

import mongoose from 'mongoose';
import { CategoryModel } from '../models/CategoryModel';
import { categorySeed } from '../categorySeed';

const MONGO_URI = 'mongodb://localhost:27017/your-db-name'; // שנה ל־URI שלך

const seedCategories = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await CategoryModel.deleteMany({});
        console.log('🗑️ Existing categories removed');

        await CategoryModel.insertMany(categorySeed);
        console.log('🌱 Categories seeded successfully');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding categories:', err);
        process.exit(1);
    }
};

seedCategories();
