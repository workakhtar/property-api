import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
const morgan = require('morgan');
import { propertyRoutes } from './routes/propertyRoutes';
import { ownerRoutes } from './routes/ownerRoutes';
import { authRoutes } from './routes/authRoutes';
import { rateLimiter } from './middleware/rateLimiter';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(morgan('combined'));

// Routes
app.use('/auth', authRoutes);
app.use('/property', propertyRoutes);
app.use('/owners', ownerRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;