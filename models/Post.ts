import mongoose from 'mongoose';

const PostCommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: String,
}, { _id: false });

const PostRatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  feedback: String,
}, { _id: false });

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  image: String,
  createdAt: String,

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [PostCommentSchema],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shares: Number,

  tags: [String],
  category: String,
  ratings: [PostRatingSchema],
  averageRating: Number,
  views: Number,
  reports: Number,
  isPinned: Boolean,
  isHidden: Boolean,
  expireAt: String,
});

export default mongoose.model('Post', PostSchema);
