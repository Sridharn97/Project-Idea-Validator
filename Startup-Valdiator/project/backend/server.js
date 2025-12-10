import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS to allow requests from Vercel deployments and localhost
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    'https://startup-valdiator.vercel.app',
    /\.vercel\.app$/,  // Allow all Vercel deployments
    /\.netlify\.app$/  // Allow all Netlify deployments if needed
  ],
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://sridharn2023cse:sridhar@cluster0.5hs1joo.mongodb.net/Startups')
  .then(() => console.log('✅ MongoDB connected...'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Startup Idea Validator API is running...');
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
