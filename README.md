# Movie API

This project is the server-side component of the Female Filmmakers web application.
It was built built as a task for Achievement 2 in Career Foundry's Full-Stack Web Development Program.

## About

The web application will provide users with access to information about different female filmmakers and their work.
For now, the database consists of several female directors and their feature-length films (with a minimum of 80 minutes as defined by the Screen Actors Guild).
Users will be able to sign up, update their personal information, and create a list of their favorite movies.

In the future, I want to update the database with women in other off-screen professions such as writers, cinematographers and production designers and include a function to find a specific person by name and receive general information about them, as well as a list of their work.

## Key Features

- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a
  single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister

## User Stories

- As a user, I want to be able to receive information on movies, directors, and genres so that I can learn more about movies I’ve watched or am interested in.
- As a user, I want to be able to create a profile so I can save data about my favorite movies.

## Technical requirements

- The API must be a Node.js and Express application.
- The API must use REST architecture, with URL endpoints corresponding to the data
  operations listed above
- The API must use at least three middleware modules, such as the body-parser package for
  reading data from requests and morgan for logging.
- The API must use a “package.json” file.
- The database must be built using MongoDB.
- The business logic must be modeled with Mongoose.
- The API must provide movie information in JSON format.
- The JavaScript code must be error-free.
- The API must be tested in Postman.
- The API must include user authentication and authorization code.
- The API must include data validation logic.
- The API must meet data security regulations.
- The API source code must be deployed to a publicly accessible platform like GitHub.
- The API must be deployed to Heroku.

## Tech stack

[Node.js](https://nodejs.org/en)
[Express](https://expressjs.com)

## Dependencies

```
"bcrypt": "^5.1.0",
  "body-parser": "^1.20.2",
  "cors": "^2.8.5",
  "express": "^4.18.2",
  "express-validator": "^6.15.0",
  "jsonwebtoken": "^9.0.0",
  "mongoose": "^7.0.2",
  "morgan": "^1.10.0",
  "passport": "^0.6.0",
  "passport-jwt": "^4.0.1",
  "passport-local": "^1.0.0",
  "uuid": "^9.0.0"
```

## Links

- [Project Brief](https://images.careerfoundry.com/public/courses/fullstack-immersion/full-stack-project-briefs/A5-Project-Brief-Mar2023.pdf)
- [Heroku](https://www.heroku.com)

## Documentation

<https://female-filmmakers.herokuapp.com/documentation.html>

## Web View

![Documentation Web View](https://github.com/NeleSchallenberg/movie-api/blob/main/docs/movie-api.png)
