import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Movie } from './movie.model';
import { Actor } from './actor.model';

@Resolver(() => Actor)
export class ActorResolver {
  @ResolveField(() => [Movie])
  public async movies(@Parent() actor: Actor): Promise<Movie[]> {
    return actor.movies();
  }
}
