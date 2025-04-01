import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
}, { _id: false });

const AreaVisitedSchema = new mongoose.Schema({
  name: String,
  lastVisited: String,
  frequency: Number,
}, { _id: false });

const AppUsageStatsSchema = new mongoose.Schema({
  totalLogins: Number,
  averageSessionDuration: Number,
  lastActiveDate: String,
}, { _id: false });

const RatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  feedback: String,
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  gender: String,
  profileImage: String,
  phoneNumber: String,
  age: Number,

  location: LocationSchema,
  lastKnownLocation: LocationSchema,
  homeLocation: LocationSchema,
  workLocation: LocationSchema,
  areasVisited: [AreaVisitedSchema],
  searchRadiusKm: Number,

  interests: [String],
  preferredCategories: [String],
  preferredDistanceKm: Number,
  preferredInteractionType: [String],

  appUsageStats: AppUsageStatsSchema,
  registrationDate: String,
  mostActiveHours: [Number],
  mostActiveDays: [String],
  deviceType: String,

  viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  viewedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  viewedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  recentSearches: [String],

  chats: [String],
  messagesSent: Number,
  messagesReceived: Number,
  connectionsCount: Number,

  ratingsGiven: [RatingSchema],
  ratingsReceived: [RatingSchema],
  averageRating: Number,

  likedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  consultations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' }],
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('User', UserSchema);
