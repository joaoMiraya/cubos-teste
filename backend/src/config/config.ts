import dotenv from 'dotenv';
import { Config, DatabaseType, NodeEnv } from '../interfaces/ISystem';

dotenv.config();

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getNumberEnvVar(name: string, defaultValue?: number): number {
  const value = process.env[name];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid number for environment variable ${name}: ${value}`);
  }
  return parsed;
}

function getNodeEnv(): NodeEnv {
  const env = process.env.NODE_ENV || 'development';
  if (!['development', 'production', 'test'].includes(env)) {
    throw new Error(`Invalid NODE_ENV: ${env}. Must be 'development', 'production', or 'test'`);
  }
  return env as NodeEnv;
}

function getDatabaseType(): DatabaseType {
  const type = getRequiredEnvVar('DATABASE_TYPE');
  if (!['postgres', 'mysql', 'sqlite', 'mongodb'].includes(type)) {
    throw new Error(`Invalid DATABASE_TYPE: ${type}. Must be 'postgres', 'mysql', 'sqlite', or 'mongodb'`);
  }
  return type as DatabaseType;
}

function getCorsOrigins(): string[] {
  const origins = process.env.CORS_ORIGIN || 'http://localhost:3000';
  return origins.split(',').map(origin => origin.trim());
}

const config: Config = {
  port: getNumberEnvVar('PORT', 3000),
  nodeEnv: getNodeEnv(),
  apiVersion: process.env.API_VERSION || 'v1',
  database: {
    url: getRequiredEnvVar('DATABASE_URL'),
    type: getDatabaseType(),
    host: getRequiredEnvVar('DATABASE_HOST'),
    port: getNumberEnvVar('DATABASE_PORT', 5432),
    username: getRequiredEnvVar('DATABASE_USERNAME'),
    password: getRequiredEnvVar('DATABASE_PASSWORD'),
    database: getRequiredEnvVar('DATABASE_NAME'),
  },
  jwt: {
    secret: getRequiredEnvVar('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: getRequiredEnvVar('JWT_REFRESH_SECRET'),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origins: getCorsOrigins(),
  },
};

export default config;