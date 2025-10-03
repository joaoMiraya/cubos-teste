export type NodeEnv = 'development' | 'production' | 'test';
export type DatabaseType = 'postgres' | 'mysql' | 'sqlite' | 'mongodb';

export interface DatabaseConfig {
  url: string;
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface CorsConfig {
  origins: string[];
}

export interface Config {
  port: number;
  nodeEnv: NodeEnv;
  apiVersion: string;
  database: DatabaseConfig;
  jwt: JwtConfig;
  cors: CorsConfig;
}