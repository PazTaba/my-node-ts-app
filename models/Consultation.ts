import mongoose from 'mongoose';

const AnswerCommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: String,
}, { _id: false });

const ConsultationAnswerSchema = new mongoose.Schema({
  id: String,
  text: String,
  author: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: Number,
  createdAt: String,
  comments: [AnswerCommentSchema],
  isBestAnswer: Boolean,
  rating: Number,
}, { _id: false });

const ConsultationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  author: String,
  question: String,
  description: String,
  category: String,
  answers: [ConsultationAnswerSchema],
  likes: Number,
  views: Number,
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
  relatedConsultations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' }],
  status: String,
  isAnonymous: Boolean,
  expireAt: String,
  isPinned: Boolean,
  location: {
    latitude: Number,
    longitude: Number,
  },
  createdAt: String,
});

export default mongoose.model('Consultation', ConsultationSchema);
