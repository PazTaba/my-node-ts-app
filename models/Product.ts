import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    createdAt: String,
}, { _id: false });

const RatingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    feedback: String,
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    condition: String,
    address: String,
    price: Number,
    distance: Number,
    image: String,
    category: String,
    latitude: Number,
    longitude: Number,
    createdAt: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    views: Number,
    likes: Number,
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    comments: [CommentSchema],
    ratings: [RatingSchema],
    averageRating: Number,
    tags: [String],
    status: String,
    isFree: Boolean,
    expireAt: String,
});

export default mongoose.model('Product', ProductSchema);
