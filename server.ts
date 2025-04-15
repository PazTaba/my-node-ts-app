import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/khila';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(3000, '0.0.0.0', () => {
      console.log("✅ Server running on port 3000");
    });

  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err);
  });
