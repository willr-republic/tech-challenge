import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule as NestGraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { AppService } from './app.service';
import { config } from '../config/config';
import { PostgresModule } from '../postgres/postgres.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),

    PostgresModule,

    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: true,
      subscriptions: {
        "graphql-ws": {
          path: "/graphql",
        },
      },
    }),

    MoviesModule,
  ],
  providers: [AppService],
})
export class AppModule {}
