import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import shortUrlRoutes from './routes/shortUrl.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/', shortUrlRoutes);

// Error handler
app.use(errorHandler);

export default app;
