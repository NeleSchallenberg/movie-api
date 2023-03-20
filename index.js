//Importing Mongoose package and models.js file
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movie = Models.Movie;
const User = Models.User;

// Connecting to database "cfDB"
mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Importing Express module, Morgan logging middleware, body-parser and uuid
const express = require('express'),
    morgan = require('morgan'),
    uuid = require('uuid'),
    bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());


// let movies = [
//     { 
//         'Title': 'Drive My Car',
//         'Description': '...',
//         'Genre': {
//             'Name': 'Drama',
//             'Description': 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
//         },
//         'Year': 2021,
//         'Director': {
//             'Name': 'Ryusuke Hamaguchi',
//             'Bio': '...'
//         }
//     },

//     { 
//         'Title': 'The Royal Tennenbaums',
//         'Description': '...',
//         'Genre': {
//             'Name': '...',
//             'Description': '...'
//         },
//         'Year': 2001,
//         'Director': {
//             'Name': 'Wes Anderson',
//             'Bio': 'Wesley Wales Anderson was born on May 1, 1969, in Houston, Texas. His films are known for their eccentricity and unique visual and narrative styles. They often contain themes of grief, loss of innocence, and dysfunctional families.'
//         }
//     },

//     { 
//         'Title': 'The Virgin Suicides',
//         'Description': '...',
//         'Genre': {
//             'Name': '...',
//             'Description': '...'
//         },
//         'Year': 1999,
//         'Director': {
//             'Name': 'Sofia Coppola',
//             'Bio': '...'
//         }
//     },

//     { 
//         'Title': 'Billy Elliot',
//         'Description': '...',
//         'Genre': {
//             'Name': '...',
//             'Description': '...'
//         },
//         'Year': 2000,
//         'Director': {
//             'Name': 'Stephen Daldry',
//             'Bio': '...'
//         }
//     },

//     { 
//         'Title': 'The Life Aquatic with Steve Zissou',
//         'Description': '...',
//         'Genre': {
//             'Name': '...',
//             'Description': '...'
//         },
//         'Year': 2004,
//         'Director': {
//             'Name': 'Wes Anderson',
//             'Bio': '...'
//         }
//     },

//     { 
//         'Title': 'Inception',
//         'Description': '...',
//         'Genre': {
//             'Name': '...',
//             'Description': '...'
//         },
//         'Year': 2010,
//         'Director': {
//             'Name': 'Christopher Nolan',
//             'Bio': '...'
//         }
//     },

//     { 
//         'Title': 'La La Land',
//         'Description': '...',
//         'Genre': {
//             'Name': '...',
//             'Description': '...'
//         },
//         'Year': 2016,
//         'Director': {
//             'Name': 'Damien Chazelle',
//             'Bio': '...'
//         }
//     },

//     { 
//         'Title': 'Mystic River',
//         'Description': '...',
//         'Genre': {
//             'Name': '...',
//             'Description': '...'
//         },
//         'Year': 2003,
//         'Director': {
//             'Name': 'Clint Eastwood',
//             'Bio': '...'
//         }
//     },

//     { 
//         'Title': 'Across the Universe',
//         'Description': '...',
//         'Genre': {
//             'Name': '...',
//             'Description': '...'
//         },
//         'Year': 2007,
//         'Director': {
//             'Name': 'Julie Taymor',
//             'Bio': '...'
//         }
//     },

//     { 
//         'Title': 'Cold War',
//         'Description': '...',
//         'Genre': {
//             'Name': '...',
//             'Description': '...'
//         },
//         'Year': 2018,
//         'Director': {
//             'Name': 'Paweł Pawlikowski',
//             'Bio': '...'
//         }
//     },
// ]

// let users = [
//     {
//         id: 1,
//         name: 'Regina',
//         favoriteMovies: ['The Prestige']
//     },

//     {
//         id: 2,
//         name: 'Miles',
//         favoriteMovies: ['Pulp Fiction']
//     }
// ]

// Returns a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to my my Movie API!')
});

// Returns a list of all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies)
});

// Returns data about a single movie by title
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title );
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).send('Movie not found :(')
    }
});

// Returns data about a genre by name
app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;
    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(404).send('Genre not found :(')
    }
});

// Returns data about a director by name
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;
    if (director) {
        res.status(200).json(director);
    } else {
        res.status(404).send('Director not found :(')
    }
});

app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
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

// // POST request creating a new user, expecting JSON format
// app.post('/users', (req, res) => {
//     User.findOne({Username: req.body.Username}).then((user) => {
//         if (user) {
//             return res.status(400).send(req.body.Username + 'already exists.')
//         } else {
//             User.create({
//                 Username: req.body.Username,
//                 Password: req.body.Password,
//                 Email: req.body.Email,
//                 Birthday: req.body.Birthday
//             })
//             .then((user) => {
//                 res.status(201).json(user);
//             })
//             .catch((error) => {
//                 console.error(error);
//                 res.status(500).send('Error:' + error);
//             })
//         }
//     })
//     .catch((error) => {
//         console.error(error);
//         res.status(500).send('Error:' + error);
//     });
// });



// // Registers new user
// app.post('/users', (req, res) => {
//     const newUser = req.body;

//     if (newUser.name) {
//         newUser.id = uuid.v4();
//         users.push(newUser);
//         res.status(201).json(newUser)
//     } else {
//         res.status(400).send('Name is required.')
//     }
// });

// Updates user name
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('User not found :(')
    }
});

// Adds movie to user favorite list by name
app.post('/users/:name/:movieTitle', (req, res) => {
    const { name, movieTitle } = req.params;

    let user = users.find( user => user.name == name );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${name}'s list!`);
    } else {
        res.status(400).send('User not found :(')
    }
});

// Removes movie from user favorite list by name
app.delete('/users/:name/:movieTitle', (req, res) => {
    const { name, movieTitle } = req.params;

    let user = users.find( user => user.name == name );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from ${name}'s list!`);
    } else {
        res.status(400).send('User not found :(')
    }
});

// Removes user by ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`User ${id} has been deleted.`);
    } else {
        res.status(400).send('User not found :(')
    }
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