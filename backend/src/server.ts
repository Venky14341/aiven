import mongoose from 'mongoose';
import app from './app';
import { config } from './config/env';

const host = process.env.HOST || '0.0.0.0';
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/investiq';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.port, host, () => {
      console.log(`Investment research API running on http://${host}:${config.port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

