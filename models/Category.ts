import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: String,
  icon: String,
  color: String,
  type: String,

  translations: {
    type: Map,
    of: String,
  },

  relatedInterests: [String],
  tags: [String],
  popularity: Number,
  usageCount: Number,
  isFeatured: Boolean,
  sortOrder: Number,
  isActive: Boolean,
  createdAt: String,
});

export default mongoose.model('Category', CategorySchema);
