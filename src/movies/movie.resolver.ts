import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";

import { Movie } from "./movie.model";
import { Director } from "./director.model";
import { IMovieRepository } from "./interfaces";
import { Types } from "./types";
import { Actor } from "./actor.model";

@Resolver(() => Movie)
export class MovieResolver {
  public constructor(
    @Inject(Types.IMovieRepository)
    private readonly movieRepository: IMovieRepository,
  ) {}

  @Query(() => [Movie])
  public async movies(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<Movie[]> {
    return await this.movieRepository.getMovies(limit);
  }

  @ResolveField(() => Director)
  public async director(@Parent() movie: Movie): Promise<Director> {
    return movie.director();
  }

  @ResolveField(() => [Actor])
  public async actors(@Parent() movie: Movie): Promise<Actor[]> {
    return movie.actors();
  }
}
