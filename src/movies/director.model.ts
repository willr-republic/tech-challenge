import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { MovieRepository } from './movie.repository';
import { DirectorRepository } from './director.repository';
import { Types } from './types';
import { IMovieRepository } from './interfaces';
import { Movie } from './movie.model';

@ObjectType('Director')
export class Director {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public name: string;

  public constructor(
    @Inject(Types.IMovieRepository)
    private readonly movieRepository: IMovieRepository,
  ) {}

  public init({ id, name }: { id: string; name: string }) {
    this.id = id;
    this.name = name;
  }

  /**
   * Returns the movies directed by the director.
   */
  public async movies(): Promise<Movie[]> {
    const movies = await this.movieRepository.directedBy(this.id);
    return movies;
  }
}
