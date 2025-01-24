import pg, { Pool } from 'pg';
import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'node:fs';

import { PostgresConfig } from '../config/config.interface';
import dedent from 'dedent';

@Injectable()
export class PostgresService implements OnApplicationShutdown, OnModuleInit {
  private readonly logger = new Logger(PostgresService.name);

  public readonly pool: Pool;

  public constructor(configService: ConfigService) {
    const postgresConfig = configService.get<PostgresConfig>('postgres')!;
    const pool = new pg.Pool({
      connectionString: postgresConfig.databaseUrL,
    });
    this.pool = pool;
  }

  public async onModuleInit() {
    const res = await this.query(dedent`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `);
    if (res.rows.length === 0) {
      const data = await fs.promises.readFile('data/imdb.sql', 'utf-8');
      await this.query(data);
    }
  }

  public async onApplicationShutdown() {
    await this.pool.end();
  }

  public async query<R extends pg.QueryResultRow = any, I = any[]>(
    queryTextOrConfig: string | pg.QueryConfig<I>,
    values?: pg.QueryConfigValues<I>,
  ): Promise<pg.QueryResult<R>> {
    this.logger.debug({ queryTextOrConfig, values });

    return this.pool.query(queryTextOrConfig, values);
  }
}
