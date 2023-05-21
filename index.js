// Import modules and middleware
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const bcrybt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

// Connect to local database "cfDB"
// mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to remote database "cfDB" via environment variable
mongoose.connect(process.env.CONNECTION_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cross-Origin Recource Sharing policy
const cors = require('cors');
app.use(cors());
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://female-filmmakers.netlify.app'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true);
//   }
// }));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

/**
 * GET request returning a WELCOME MESSAGE at "/" endpoint
 * @name welcomeMessage
 * @kind function
 * @returns welcome message
 */
app.get('/', (req, res) => {
	console.log('App is listening on port 8080.');
	res.send('Welcome to my Movie API!');
});

/**
 * GET the API DOCUMENTATION at "/documentation" endpoint
 * @name documentation
 * @kind function
 * @returns API documentation
 */
app.get('/documentation', (req, res) => {
	res.sendFile('public/documentation.html', { root: __dirname });
});

/**
 * GET request returning a list of ALL MOVIES at "/movies" endpoint
 * @name movies
 * @kind function
 * @returns array of movie objects
 * @requires passport
 */
app.get(
	'/movies',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.find()
			.then((movies) => {
				console.log('200 - The request was fulfilled.');
				res.status(201).json(movies);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

/**
 * GET request returning MOVIE BY TITLE at "/movies/[Title]" endpoint
 * @name movie
 * @param {string} Title movie title
 * @kind function
 * @returns movie object
 * @requires passport
 */
app.get(
	'/movies/:Title',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ Title: req.params.Title })
			.then((movie) => {
				console.log('200 - The request was fulfilled.');
				res.status(201).json(movie);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

/**
 * GET request returning MOVIES BY GENRE at "/movies/genre[genreName]" endpoint
 * @name genreMovies
 * @param {string} genre genre name
 * @kind function
 * @returns array movie objects
 * @requires passport
 */
app.get(
	'/movies/genre/:genreName',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.find({ 'Genre.Name': req.params.genreName })
			.then((genre) => {
				console.log('200 - The request was fulfilled.');
				res.json(genre);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

/**
 * GET request returning MOVIES BY DIRECTOR at "/movies/director[directorName]" endpoint
 * @name directorMovies
 * @param {string} directorName director name
 * @kind function
 * @returns array movie objects
 * @requires passport
 */
app.get(
	'/movies/director/:directorName',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.find({ 'Director.Name': req.params.directorName })
			.then((director) => {
				console.log('200 - The request was fulfilled.');
				res.json(director);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

/**
 * GET request returning information about a DIRECTOR at "/movies/directors/[directorName]" endpoint
 * @name director
 * @param {string} directorName director name
 * @kind function
 * @returns director object
 * @requires passport
 */
app.get(
	'/movies/directors/:directorName',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ 'Director.Name': req.params.directorName })
			.then((movie) => {
				if (movie) {
					console.log(
						'200 - The request was fulfilled.'
					);
					res.status(200).json(movie.Director);
				} else {
					return res
						.status(400)
						.send(
							req.params
								.directorName +
								' was not found in the database.'
						);
				}
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

/**
 * GET request returning information about a GENRE at "/movies/genres/[genreName]" endpoint
 * @name genre
 * @param {string} genreName genre name
 * @kind function
 * @returns genre object
 * @requires passport
 */
app.get(
	'/movies/genres/:genreName',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ 'Genre.Name': req.params.genreName })
			.then((movie) => {
				if (movie) {
					console.log(
						'200 - The request was fulfilled.'
					);
					res.status(200).json(movie.Genre);
				} else {
					return res
						.status(400)
						.send(
							'The genre ' +
								req.params
									.genreName +
								' was not found in the database.'
						);
				}
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

/**
 * POST request creating NEW USER at "/users" endpoint
 * @name registerUser
 * @param {string} Username username
 * @param {string} Password password
 * @param {string} Email email
 * @param {date} Birthday birthday
 * @kind function
 */
app.post(
	'/users',
	[
		check('Username', 'Username is required').not().isEmpty(),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Password', 'Password is required').isLength({ min: 8 }),
		check(
			'Password',
			'Password contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Email', 'Email is not valid').isEmail(),
		//check('Birthday', 'Birthday is not valid').is ??? ()
	],
	(req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOne({ Username: req.body.Username })
			.then((user) => {
				if (user) {
					return res
						.status(400)
						.send(
							req.body.Username +
								' already exists!'
						);
				} else {
					Users.create({
						Username: req.body.Username,
						Password: hashedPassword,
						Email: req.body.Email,
						Birthday: req.body.Birthday,
					})
						.then((user) => {
							console.log(
								'200 - The request was fulfilled.'
							);
							res.status(201).json(
								user
							);
						})
						.catch((error) => {
							console.error(error);
							res.status(500).send(
								'Error: ' +
									error
							);
						});
				}
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send('Error: ' + error);
			});
	}
);

/**
 * GET request returning ALL USERS at "/users" endpoint
 * @name users
 * @kind function
 * @returns array of user objects
 */
app.get(
	'/users',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.find()
			.then((users) => {
				console.log('200 - The request was fulfilled.');
				res.status(201).json(users);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

/**
 * GET request returning USER BY USERNAME at "/users/[Username]" endpoint
 * @name user
 * @param {string} Username username
 * @kind function
 * @returns movie object
 * @requires passport
 */
app.get(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOne({ Username: req.params.Username })
			.then((user) => {
				if (!user) {
					return res
						.status(400)
						.send('User does not exist!');
				} else {
					console.log(
						'200 - The request was fulfilled.'
					);
					res.status(201).json(user);
				}
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

//
/**
 * PUT request allowing user to UPDATE USER DATA by Username at "/users/[Username]" endpoint
 * @name updateUser
 * @param {string} Username username
 * @param {string} Password password
 * @param {string} Email email
 * @param {date} Birthday birthday
 * @kind function
 * @requires passport
 */
app.put(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	[
		check('Username', 'Username is required').not().isEmpty(),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Password', 'Password is required').isLength({ min: 8 }),
		check(
			'Password',
			'Password contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Email', 'Email is not valid').isEmail(),
		//check('Birthday', 'Birthday is not valid').is ??? ()
	],
	(req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log('Something went wrong!');
			return res.status(422).json({ errors: errors.array() });
		}
		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					Username: req.body.Username,
					Password: hashedPassword,
					Email: req.body.Email,
					Birthday: req.body.Birthday,
				},
			},
			{ new: true }
		)
			.then((updatedUser) => {
				console.log('200 - The request was fulfilled.');
				res.status(201).json(updatedUser);
			})
			.catch((err) => {
				console.error(err);
				console.log('Something went wrong!');
				res.status(500).send('Error: ' + err);
			});
	}
);

/**
 * // POST request allowing users to  ADD MOVIE TO FAVORITES at "/users/[Username]/movies/[MovieID]" endpoint
 * (showing only a text that a movie has been added)
 * @name addFavoriteMovie
 * @param {string} Username username
 * @param {string} MovieID movie ID
 * @kind function
 * @requires passport
 */
app.post(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$push: { FavoriteMovies: req.params.MovieID },
			},
			{ new: true }
		)
			.then((updatedUser) => {
				console.log('Favorite movie was added!');
				res.status(201).json(updatedUser);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

/**
 * // DELETE request allowing users to REMOVE MOVIE FROM FAVORITES at "/users/[Username]/movies/[MovieID]" endpoint
 * (showing only a text that a movie has been removed)
 * @name removeFavoriteMovie
 * @param {string} Username username
 * @param {string} MovieId movie ID
 * @kind function
 * @requires passport
 */
app.delete(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$pull: { FavoriteMovies: req.params.MovieID },
			},
			{ new: true }
		)
			.then((updatedUser) => {
				console.log('Favorite movie was deleted!');
				res.status(201).json(updatedUser);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

/**
 * // DELETE request allowing to REMOVE existing USER by Username at "/users/[Username]" endpoint
 * (showing only a text that a user has been removed)
 * @name removeUser
 * @param {string} Username user name
 * @kind function
 * @requires passport
 */
app.delete(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndRemove({ Username: req.params.Username })
			.then((user) => {
				if (!user) {
					res.status(400).send(
						req.params.Username +
							' was not found'
					);
				} else {
					res.status(200).send(
						req.params.Username +
							' was deleted.'
					);
				}
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

// Creates error-handling middleware function
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
	console.log('Listening on Port ' + port);
});
