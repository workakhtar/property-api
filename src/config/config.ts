import dotenv from 'dotenv';
import { JwtConfig } from '../types/jwt';

dotenv.config();

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue!;
};

export const config = {
  port: parseInt(getEnvVar('PORT', '5000')),
  database: {
    host: getEnvVar('PGHOST', 'localhost'),
    port: parseInt(getEnvVar('PGPORT', '5432')),
    user: getEnvVar('PGUSER'),
    password: getEnvVar('PGPASSWORD'),
    database: getEnvVar('PGDATABASE'),
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    expiresIn: '24h',
  } as JwtConfig,
  propertyReachApi: {
    baseUrl: getEnvVar('PROPERTY_REACH_API_URL', 'https://api.propertyreach.com'),
    apiKey: getEnvVar('PROPERTY_REACH_API_KEY'),
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};