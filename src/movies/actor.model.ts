import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { IMovieRepository } from './interfaces';
import { Types } from './types';
import { Movie } from './movie.model';

@ObjectType('Actor')
export class Actor {
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
   * Returns the movies the actor acted in.
   */
  public movies(): Promise<Movie[]> {
    return this.movieRepository.starring(this.id);
  }
}
