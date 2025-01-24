import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { PostgresService } from '../postgres/postgres.service';
import { DbActor, IActorRepository } from './interfaces';
import { Actor } from './actor.model';
import dedent from 'dedent';

@Injectable()
export class ActorRepository implements IActorRepository {
  public constructor(
    private readonly moduleRef: ModuleRef,
    private readonly postgres: PostgresService,
  ) {}

  /**
   * Retrieves the actor with the given id.
   */
  public async getActor(id: string): Promise<Actor | null> {
    const res = await this.postgres.query<DbActor>(
      `SELECT * FROM "actors" WHERE "id" = $1`,
      [id],
    );
    if (!res.rows.length) {
      return null;
    }
    return this.createActor(res.rows[0]!);
  }

  /**
   * Retrieves {limit} number of actors.
   */
  public async getActors(limit: number): Promise<Actor[]> {
    const res = await this.postgres.query<DbActor>(
      `SELECT * FROM "actors" LIMIT $1`,
      [limit],
    );

    return Promise.all(
      res.rows.map(async (dbActor) => this.createActor(dbActor)),
    );
  }

  /**
   * Retrieves the actors that acted in the specified movie.
   */
  public async actedIn(movieId: string): Promise<Actor[]> {
    const res = await this.postgres.query<DbActor>(
      dedent`
        SELECT "actors".*
        FROM "movie_actors"
        LEFT JOIN "actors" ON "actors"."id" = "movie_actors"."actor_id"
        WHERE "movie_actors"."movie_id" = $1
      `,
      [movieId],
    );
    return Promise.all(
      res.rows.map(async (dbActor) => this.createActor(dbActor)),
    );
  }

  private async createActor(dbActor: DbActor): Promise<Actor> {
    const actor = await this.moduleRef.resolve(Actor);
    actor.init({
      id: dbActor.id,
      name: dbActor.name,
    });
    return actor;
  }
}
