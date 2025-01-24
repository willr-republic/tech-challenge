import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { PostgresService } from '../postgres/postgres.service';
import { Director } from './director.model';
import { IDirectorRepository } from './interfaces';

@Injectable()
export class DirectorRepository implements IDirectorRepository {
  public constructor(
    private readonly moduleRef: ModuleRef,
    private readonly postgres: PostgresService,
  ) {}

  /**
   * Retrieves the director with the specified id.
   */
  public async getDirector(id: string): Promise<Director | null> {
    const res = await this.postgres.query<{
      id: string;
      name: string;
    }>(`SELECT * FROM "directors" WHERE id = $1`, [id]);

    if (!res.rows.length) {
      return null;
    }
    const director = await this.moduleRef.resolve(Director);
    director.init(res.rows[0]!);
    return director;
  }

  /**
   * Retrieves {limit} number of directors.
   */
  public async getDirectors(limit: number): Promise<Director[]> {
    const res = await this.postgres.query<{
      id: string;
      name: string;
    }>(`SELECT * FROM "directors" LIMIT $1`, [limit]);

    return Promise.all(
      res.rows.map(async (row) => {
        const director = await this.moduleRef.resolve<Director>(Director);
        director.init({
          id: row.id,
          name: row.name,
        });
        return director;
      }),
    );
  }
}
