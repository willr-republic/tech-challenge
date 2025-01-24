import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Movie } from "./movie.model";
import { Director } from "./director.model";

@Resolver(() => Director)
export class DirectorResolver {
  @ResolveField(() => [Movie])
  public async movies(@Parent() director: Director): Promise<Movie[]> {
    return director.movies();
  }
}
