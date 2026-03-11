import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import reportRoutes from './routes/reports.js';

const app = express();
const PORT = process.env.PORT ?? 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(fileUpload({ 
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 },

 }));
app.use('/public/reports', express.static('public/reports'));
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/reports', reportRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start();
