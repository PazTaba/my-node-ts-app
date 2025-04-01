// models/Analytics.ts
import mongoose from 'mongoose';

const AnalyticsEventSchema = new mongoose.Schema({
  type: String,
  itemId: String,
  itemType: String,
  query: String,
  results: Number,
  filters: {},
  contactType: String,
  shareMethod: String,
  formType: String,
  success: Boolean,
  screenName: String,
  duration: Number,
  latitude: Number,
  longitude: Number,
  targetId: String,
  timestamp: { type: Date, default: Date.now },
}, { _id: false, strict: false });

const AnalyticsSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  userId: { type: String, required: true }, // יכול להיות מזהה משתמש רגיל או אנונימי
  startTime: { type: Date, required: true },
  endTime: Date,
  deviceInfo: {
    os: String,
    platform: String,
    screenSize: String,
  },
  events: [AnalyticsEventSchema],
  createdAt: { type: Date, default: Date.now },
});

const UserAnalyticsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AnalyticsSession' }],
  lastActive: { type: Date, default: Date.now },
  totalSessions: { type: Number, default: 0 },
  
  // סיכום נתונים לניתוח
  interests: { type: Map, of: Number, default: () => new Map() },
  
  locationData: {
    mostFrequentLocations: [{
      latitude: Number,
      longitude: Number,
      frequency: Number,
      lastVisit: Date,
    }],
    averageRadius: Number,
  },
  
  behaviorMetrics: {
    averageSessionDuration: Number, // בשניות
    mostActiveHourOfDay: Number, // 0-23
    mostActiveDayOfWeek: Number, // 0-6
    engagementScore: Number, // 0-100
  },
  
  updatedAt: { type: Date, default: Date.now },
});

// אינדקסים לשיפור ביצועים
AnalyticsSessionSchema.index({ sessionId: 1 });
AnalyticsSessionSchema.index({ userId: 1 });
UserAnalyticsSchema.index({ userId: 1 }, { unique: true });

export const AnalyticsSession = mongoose.model('AnalyticsSession', AnalyticsSessionSchema);
export const UserAnalytics = mongoose.model('UserAnalytics', UserAnalyticsSchema);