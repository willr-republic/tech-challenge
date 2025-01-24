import { Module, Scope } from '@nestjs/common';

import { PostgresModule } from '../postgres/postgres.module';

import { MovieRepository } from './movie.repository';
import { DirectorRepository } from './director.repository';

import { MovieResolver } from './movie.resolver';

import { Movie } from './movie.model';
import { Director } from './director.model';
import { Actor } from './actor.model';
import { Types } from './types';
import { DirectorResolver } from './director.resolver';
import { ActorRepository } from './actor.repository';
import { ActorResolver } from './actor.resolver';

@Module({
  imports: [PostgresModule],
  controllers: [],
  providers: [

    {
      provide: Types.IMovieRepository,
      useClass: MovieRepository,
    },
    {
      provide: Types.IDirectorRepository,
      useClass: DirectorRepository,
    },
    {
      provide: Types.IActorRepository,
      useClass: ActorRepository,
    },

    {
      provide: Movie,
      useClass: Movie,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Actor,
      useClass: Actor,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Director,
      useClass: Director,
      scope: Scope.TRANSIENT,
    },

    MovieResolver,
    DirectorResolver,
    ActorResolver,
  ],
})
export class MoviesModule {}
