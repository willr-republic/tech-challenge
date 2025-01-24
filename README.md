## Run

```sh
docker compose up -d
npm install
npm run start:dev
```

## Usage

Open the [GraphQL Playground](http://localhost:3000/graphql).

Run this query:

```gql
query GetMovies {
  movies {
    id
    title
    year
    actors {
      id
      name
      movies {
        id
        title
        director {
          id
          name
        }
      }
    }
    director {
      id
      name
      movies {
        id
        title
      }
    }
  }
}
```


## Relationship Diagram

```mermaid
erDiagram
    ACTOR ||--o{ MOVIE_ACTORS : "acts in"
    MOVIE ||--|{ MOVIE_ACTORS : stars
    DIRECTOR ||--o{ MOVIE: directs
```

## Class Diagram

```mermaid
classDiagram
    namespace Models {
        class Director {
            +string id
            +string name

            +movies() Movie[]
        }

        class Movie {
            +string id
            +string title
            +string directorId

            +director() Director
            +actors() Actor[]
        }

        class Actor {
            +string id
            +string name

            +movies() Movie[]
        }
    }

    namespace Repositories {

        class ActorRepository {
            +getActor(String id) Actor
            +getActors(Int limit) Actor[]
            +actedIn(String movieId) Actor[]
        }

        class DirectorRepository {
            +getDirector(String id) Director | null
            +getDirectors(Int limit) Director[]
        }

        class MovieRepository {
            +getMovies(Int limit) Movie[]
            +directedBy(String directorId) Movie[]
            +starring(String actorId) Movie[]
        }
    }


    ActorRepository <-- Actor
    MovieRepository <-- Movie
    DirectorRepository <-- Director

    Actor --> "many" Movie : Acts
    Director --> "many" Movie : Directs
```

