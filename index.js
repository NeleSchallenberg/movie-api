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


// GET request returning a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to my my Movie API!')
});

// GET request, returning a list of all movies
app.get('/movies', (req, res) => {
    Movies.find()
    
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
    



// // Returns data about a single movie by title
// app.get('/movies/:title', (req, res) => {
//     const { title } = req.params;
//     const movie = movies.find( movie => movie.Title === title );
//     if (movie) {
//         res.status(200).json(movie);
//     } else {
//         res.status(404).send('Movie not found :(')
//     }
// });

// // Returns data about a genre by name
// app.get('/movies/genres/:genreName', (req, res) => {
//     const { genreName } = req.params;
//     const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;
//     if (genre) {
//         res.status(200).json(genre);
//     } else {
//         res.status(404).send('Genre not found :(')
//     }
// });

// // Returns data about a director by name
// app.get('/movies/directors/:directorName', (req, res) => {
//     const { directorName } = req.params;
//     const director = movies.find(movie => movie.Director.Name === directorName).Director;
//     if (director) {
//         res.status(200).json(director);
//     } else {
//         res.status(404).send('Director not found :(')
//     }
// });

// POST request creating a new user, expecting JSON format
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
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

// PUT request updating username, expecting JSON format
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, 
    {$set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
      }},
    {new: true},
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// // Adds movie to user favorite list by name
// app.post('/users/:name/:movieTitle', (req, res) => {
//     const { name, movieTitle } = req.params;

//     let user = users.find( user => user.name == name );

//     if (user) {
//         user.favoriteMovies.push(movieTitle);
//         res.status(200).send(`${movieTitle} has been added to ${name}'s list!`);
//     } else {
//         res.status(400).send('User not found :(')
//     }
// });

// // Removes movie from user favorite list by name
// app.delete('/users/:name/:movieTitle', (req, res) => {
//     const { name, movieTitle } = req.params;

//     let user = users.find( user => user.name == name );

//     if (user) {
//         user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
//         res.status(200).send(`${movieTitle} has been removed from ${name}'s list!`);
//     } else {
//         res.status(400).send('User not found :(')
//     }
// });

// // Removes user by ID
// app.delete('/users/:id', (req, res) => {
//     const { id } = req.params;

//     let user = users.find( user => user.id == id );

//     if (user) {
//         users = users.filter( user => user.id != id);
//         res.status(200).send(`User ${id} has been deleted.`);
//     } else {
//         res.status(400).send('User not found :(')
//     }
// });

// GET request reading ALL users
app.get('/users', (req, res) => {
  Users.find().then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET request reading one user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({Username: req.params.Username}).then((user) => {
    res.json(user);
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