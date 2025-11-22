import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

function buildOptions(): DataSourceOptions {
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
    } as DataSourceOptions;
  }

  const type = (process.env.DB_TYPE || 'sqlite') as any;
  if (type === 'postgres') {
    const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined;
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'lms',
      autoLoadEntities: true,
      synchronize: false,
      ssl,
    } as DataSourceOptions;
  }

  // default: sqlite (developer-friendly)
  return {
    type: 'sqlite',
    database: process.env.SQLITE_PATH || 'data.sqlite',
    autoLoadEntities: true,
    synchronize: true,
  } as DataSourceOptions;
}

export function TypeOrmRootModule() {
  return TypeOrmModule.forRoot(buildOptions());
}
