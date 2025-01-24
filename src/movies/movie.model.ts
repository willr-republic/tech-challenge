import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Inject } from '@nestjs/common';

import { IActorRepository, IDirectorRepository } from './interfaces';
import { Types } from './types';
import { Director } from './director.model';
import { Actor } from './actor.model';

@ObjectType('Movie')
export class Movie {
  @Field(() => ID)
  public id: string;

  @Field(() => Int)
  public year: number;

  @Field(() => String)
  public title: string;

  private directorId: string;

  public constructor(
    @Inject(Types.IActorRepository)
    private readonly actorRepository: IActorRepository,

    @Inject(Types.IDirectorRepository)
    private readonly directorRepository: IDirectorRepository
  ) {}

  public init({
    id,
    year,
    title,
    directorId,
  }: {
    id: string;
    year: number;
    title: string;
    directorId: string;
  }) {
    this.id = id;
    this.year = year;
    this.title = title;
    this.directorId = directorId;
  }

  /**
   * Returns the movie's director.
   */
  public async director(): Promise<Director> {
    const director = await this.directorRepository.getDirector(this.directorId);
    if (!director) {
      throw new GraphQLError('director not found');
    }
    return director;
  }

  /**
   * Returns the movie's actors.
   */
  public actors(): Promise<Actor[]> {
    return this.actorRepository.actedIn(this.id);
  }
}
