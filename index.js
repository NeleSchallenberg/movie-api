// Importing modules and middleware
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// Connecting to database "cfDB"
mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());

// GET request returning a WELCOME MESSAGE
app.get('/', (req, res) => {
    res.send('Welcome to my my Movie API!')
});

// GET request returning a list of ALL MOVIES
app.get('/movies', (req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET request returning MOVIE BY TITLE
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then((movie) => {
    res.status(201).json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET request returning MOVIES BY GENRE
app.get('/movies/genre/:genreName', (req, res) => {
  Movies.find({'Genre.Name': req.params.genreName})
  .then((genre) => {
    res.json(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET request returning MOVIES BY DIRECTOR
app.get('/movies/director/:directorName', (req, res) => {
  Movies.find({'Director.Name': req.params.directorName})
  .then((director) => {
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
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists!');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
        .then((user) =>{res.status(201).json(user) })
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
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET request returning USER BY USERNAME
app.get('/users/:Username', (req, res) => {
  Users.findOne({Username: req.params.Username})
  .then((user) => {
    if (!user) {
      return res.status(400).send(req.body.Username + 'User does not exist!')
    } else {
    res.status(201).json(user)}
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//-----------------------------------------------------------------
// NOT WORKING!!!

// PUT request UPDATING USER DATA by Username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username},
    {$set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
      }
    },
    {new: true},
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// POST request ADDING MOVIE TO FAVORITES
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
     $push: {FavoriteMovies: req.params.MovieID}
   },
   {new: true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// DELETE request REMOVING MOVIE FROM FAVORITES
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndRemove({Username: req.params.Username})
  .then((user, movie) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found!')
    } else if (!movie) {
      res.status(400).send(req.params.MovieID + ' was not found!')
    } else {
      res.status(200).send(req.params.MovieID + ' was removed.'),
      {$pull: {FavoriteMovies: req.params.MovieID}}
    }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//     , {
//      $pull: {FavoriteMovies: req.params.MovieID}
//    },
//    {new: true},
//   (err, updatedUser) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     } else {
//       res.json(updatedUser);
//     }
//   });
// });

//-----------------------------------------------------------------

// DELETE request REMOVING USER by Username
app.delete('/users/:Username', (req, res) => {
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
app.listen(8080, () => {
    console.log('App is listening on port 8080.');
});