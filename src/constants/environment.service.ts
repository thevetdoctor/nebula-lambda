import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private config: ConfigService) {}
  // Environment variables

  isLocal(): boolean {
    return this.config.get('NODE_ENV') !== 'production';
  }

  isProd(): boolean {
    return this.config.get('NODE_ENV') === 'production';
  }

  isLambda(): boolean {
    return !!this.config.get('AWS_LAMBDA_FUNCTION_NAME');
  }

  get(key: string): string | undefined {
    return this.config.get(key);
  }
  region(): string {
    return this.config.get('AWS_REGION') || 'us-east-1';
  }

  accessKeyId(): string {
    return this.config.get('AWS_ACCESS_KEY_ID') || 'local';
  }

  secretAccessKey(): string {
    return this.config.get('AWS_SECRET_ACCESS_KEY') || 'local';
  }

  dynamoEndpoint(): string {
    return this.config.get('DYNAMO_ENDPOINT') || 'http://localhost:8000';
  }

  appPort(): number {
    return Number(this.config.get('PORT')) || 3000;
  }

  DYNAMO_ENDPOINT(): string {
    return this.config.get('DYNAMO_ENDPOINT') || 'http://localhost:8000';
  }

  DYNAMODB(): string {
    return 'DYNAMODB';
  }

  tables(): string[] {
    const tables = this.config.get('DYNAMODB_TABLES');
    return tables ? tables.split(',') : ['users', 'orders', 'codes'];
  }

  userTable(): string {
    return this.config.get('DYNAMODB_USERTABLE') || 'users';
  }

  redisHost(): string {
    return this.config.get('REDIS_HOST') || 'localhost';
  }

  redisPort(): number {
    const port = this.config.get('REDIS_PORT');
    return port ? Number(port) : 6379;
  }

  redisPassword(): string | undefined {
    return this.config.get('REDIS_PASSWORD') || undefined;
  }

  cacheTtl(): number {
    const ttl = this.config.get('CACHE_TTL');
    return ttl ? Number(ttl) : 30000;
  }

  redisEnabled(): boolean {
    return this.config.get('REDIS_ENABLED') === 'true';
  }
}
