import express from 'express';
import cors from 'cors';  // Import cors
import * as dotenv from 'dotenv';
import { AppDataSource } from './db/data-source';
import eligibilityRoutes from './controllers/eligibilityController';

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS for the frontend origin
app.use(cors({
  origin: 'http://localhost:3001'  // Allow requests from frontend (adjust if frontend port changes)
}));

// Routes
app.use('/eligibility', eligibilityRoutes);

// Initialize DB
AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('DB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));