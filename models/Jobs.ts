import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    feedback: String,
}, { _id: false });

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['full', 'temp']
    },
    location: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    salary: { type: String, required: true },
    interest: {
        type: String,
        required: true,
        enum: [
            'tech', 'design', 'marketing', 'management', 'finance',
            'healthcare', 'education', 'sales', 'customerService'
        ]
    },
    description: { type: String, required: true },
    requirements: { type: [String], required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    postedDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },

    // 🧠 התאמות ומילות מפתח
    tags: [String],
    keywords: [String],

    // ❤️ אינטראקציות
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    reports: { type: Number, default: 0 },

    // ⭐ דירוגים
    ratings: [RatingSchema],
    averageRating: Number,

    // 📌 מצב משרה
    status: {
        type: String,
        enum: ['active', 'expired', 'hidden'],
        default: 'active'
    },

    // 🧠 ניקוד התאמה חכם (לשימוש עתידי)
    matchScore: Number,
});

export default mongoose.model('Jobs', JobSchema);
