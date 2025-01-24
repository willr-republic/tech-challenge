import { Actor } from "./actor.model";
import { Director } from "./director.model";
import { Movie } from "./movie.model";

export interface DbMovie {
  id: string;
  title: string;
  director_id: string;
  year: number;
}

export interface DbDirector {
  id: string;
  name: string;
}

export interface DbActor {
  id: string;
  name: string;
}

export interface IMovieRepository {
  getMovies(limit: number): Promise<Movie[]>;
  directedBy(directorId: string): Promise<Movie[]>;
  starring(actorId: string): Promise<Movie[]>;
}

export interface IDirectorRepository {
  getDirector(id: string): Promise<Director | null>;
  getDirectors(limit: number): Promise<Director[]>;
}

export interface IActorRepository {
  getActor(id: string): Promise<Actor | null>;
  getActors(limit: number): Promise<Actor[]>;
  actedIn(movieId: string): Promise<Actor[]>;
}