// Importing modules and middleware
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const bcrybt = require('bcrypt');
const {check, validationResult} = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

// Connecting to local database "cfDB"
// mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Connecting to remote database "cfDB"
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// GET request returning a WELCOME MESSAGE
app.get('/', (req, res) => {
  console.log('App is listening on port 8080.');
  res.send('Welcome to my Movie API!')
});

// GET request returning a list of ALL MOVIES
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find().then((movies) => {
    console.log('200 - The request was fulfilled.');
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET request returning MOVIE BY TITLE
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then((movie) => {
    console.log('200 - The request was fulfilled.');
    res.status(201).json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET request returning MOVIES BY GENRE
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({'Genre.Name': req.params.genreName})
  .then((genre) => {
    console.log('200 - The request was fulfilled.');
    res.json(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET request returning MOVIES BY DIRECTOR
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({'Director.Name': req.params.directorName})
  .then((director) => {
    console.log('200 - The request was fulfilled.');
    res.json(director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//-----------------------------------------------------------------
// TBD

// GET request returning information about a director
// GET request returning information about a genre

//-----------------------------------------------------------------

// POST request creating NEW USER
app.post('/users',
[
  check('Username', 'Username is required').not().isEmpty(),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').isLength({min: 8}),
  check('Password', 'Password contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Email', 'Email is not valid').isEmail(),
//check('Birthday', 'Birthday is not valid').is ??? ()
], (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + ' already exists!');
    } else {
      Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
      .then((user) => {
        console.log('200 - The request was fulfilled.');
        res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// GET request returning ALL USERS
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
  .then((users) => {
    console.log('200 - The request was fulfilled.');
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET request returning USER BY USERNAME
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({Username: req.params.Username})
  .then((user) => {
    if (!user) {
      return res.status(400).send('User does not exist!')
    } else {
      console.log('200 - The request was fulfilled.');
      res.status(201).json(user)
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// PUT request UPDATING USER DATA by Username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
[
  check('Username', 'Username is required').not().isEmpty(),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').isLength({min: 8}),
  check('Password', 'Password contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Email', 'Email is not valid').isEmail(),
//check('Birthday', 'Birthday is not valid').is ??? ()
], (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Something went wrong!');
    return res.status(422).json({errors: errors.array()});
  }
  Users.findOneAndUpdate({ Username: req.params.Username },
    {$set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
      }
    },
    {new: true})
  .then((updatedUser) => {
    console.log('200 - The request was fulfilled.');
    res.status(201).json(updatedUser) })
  .catch((err) => {
    console.error(err);
    console.log('Something went wrong!');
    res.status(500).send('Error: ' + err)
  })
});

// POST request ADDING MOVIE TO FAVORITES
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
     $push: {FavoriteMovies: req.params.MovieID}
   },
   {new: true})
   .then((updatedUser) => {
    console.log('Favorite movie was added!');
    res.status(201).json(updatedUser)})
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err)
   })
});

// DELETE request REMOVING MOVIE FROM FAVORITES
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
     $pull: {FavoriteMovies: req.params.MovieID}
   },
   {new: true})
   .then((updatedUser) => {
    console.log('Favorite movie was deleted!');
    res.status(201).json(updatedUser)})
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err)
   })
});

// DELETE request REMOVING USER by Username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Creates error-handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});