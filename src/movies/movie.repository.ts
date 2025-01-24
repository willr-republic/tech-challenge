import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { PostgresService } from '../postgres/postgres.service';
import { Movie } from './movie.model';
import { DbMovie, IMovieRepository } from './interfaces';
import dedent from 'dedent';

@Injectable()
export class MovieRepository implements IMovieRepository {
  public constructor(
    private readonly moduleRef: ModuleRef,
    private readonly postgres: PostgresService,
  ) {}

  /**
   * Retrieves the movies directed by the specified director id.
   */
  public async directedBy(directorId: string): Promise<Movie[]> {
    const res = await this.postgres.query<DbMovie>(
      dedent`
        SELECT *
        FROM "movies"
        WHERE "director_id" = $1
      `,
      [directorId],
    );

    return Promise.all(
      res.rows.map(async (dbMovie) => this.createMovie(dbMovie)),
    );
  }

  /**
   * Retrieves {limit} number of movies.
   */
  public async getMovies(limit: number): Promise<Movie[]> {
    const res = await this.postgres.query<DbMovie>(
      `SELECT * FROM "movies" LIMIT $1`,
      [limit],
    );

    return Promise.all(
      res.rows.map(async (dbMovie) => this.createMovie(dbMovie)),
    );
  }

  /**
   * Retrieves the movies the specified actor acted in.
   */
  public async starring(actorId: string): Promise<Movie[]> {
    const res = await this.postgres.query<DbMovie>(
      dedent`
        SELECT "movies".*
        FROM "movie_actors"
        LEFT JOIN "movies" ON "movies"."id" = "movie_actors"."movie_id"
        WHERE "movie_actors"."actor_id" = $1
      `,
      [actorId],
    );

    return Promise.all(
      res.rows.map(async (dbMovie) => this.createMovie(dbMovie)),
    );
  }

  private async createMovie(dbMovie: DbMovie): Promise<Movie> {
    const movie = await this.moduleRef.resolve(Movie);
    movie.init({
      id: dbMovie.id,
      title: dbMovie.title,
      year: dbMovie.year,
      directorId: dbMovie.director_id,
    });
    return movie;
  }
}
