import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SqlMigrationRunner implements OnModuleInit {
  private readonly logger = new Logger(SqlMigrationRunner.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    if (!process.env.APPLY_SQL_MIGRATIONS || process.env.APPLY_SQL_MIGRATIONS !== 'true') {
      return;
    }
    if (this.dataSource.options.type !== 'postgres') {
      this.logger.log('SQL migration runner is enabled but DB is not Postgres; skipping');
      return;
    }
    const migrationsDir = path.resolve(process.cwd(), '..', 'database', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      this.logger.warn(`Migrations directory not found: ${migrationsDir}`);
      return;
    }
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();
    for (const file of files) {
      const full = path.join(migrationsDir, file);
      const sql = fs.readFileSync(full, 'utf8');
      this.logger.log(`Applying migration: ${file}`);
      await this.dataSource.query(sql);
    }
    this.logger.log('All SQL migrations applied');
  }
}


