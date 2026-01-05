// Environment variables
export const isLocal = process.env.NODE_ENV !== 'production';
export const region = process.env.AWS_REGION || 'us-east-1';
export const accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'local';
export const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || 'local';
export const DYNAMO_ENDPOINT =
  process.env.DYNAMO_ENDPOINT || 'http://localhost:8000';
export const appPort = process.env.PORT ?? 3000;

//   Provider constants
export const DYNAMODB = 'DYNAMODB';

// Others
export const tables = process.env.TABLES
  ? process.env.TABLES.split(',')
  : ['users', 'orders', 'codes'];
export const userTable = process.env.DYNAMODB_USERTABLE ?? 'users';

export const redisHost = process.env.REDIS_HOST || 'localhost';
export const redisPort = process.env.REDIS_PORT
  ? Number(process.env.REDIS_PORT)
  : 6379;
export const redisPassword = process.env.REDIS_PASSWORD || undefined;
export const cacheTtl = process.env.CACHE_TTL
  ? Number(process.env.CACHE_TTL)
  : 30000;
export const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
export const redisEnabled = process.env.REDIS_ENABLED === 'true';
