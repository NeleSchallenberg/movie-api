// Importing Express module and Morgan logging middleware
const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));

// Declaring JSON object with top ten movies
let topMovies = [
    { 
        title: 'Drive My Car',
        year: '2021',
        director: 'Ryusuke Hamaguchi',
    },

    { 
        title: 'The Royal Tennenbaums',
        year: '2001',
        director: 'Wes Anderson',
    },

    { 
        title: 'The Virgin Suicides',
        year: '1999',
        director: 'Sofia Coppola',
    },

    { 
        title: 'Billy Elliot',
        year: '2000',
        director: 'Stephen Daldry',
    },

    { 
        title: 'The Life Aquatic with Steve Zissou',
        year: '2004',
        director: 'Wes Anderson',
    },

    { 
        title: 'Inception',
        year: '2010',
        director: 'Christopher Nolan',
    },

    { 
        title: 'La La Land',
        year: '2016',
        director: 'Damien Chazelle',
    },

    { 
        title: 'Mystic River',
        year: '2003',
        director: 'Clint Eastwood',
    },

    { 
        title: 'Across the Universe',
        year: '2007',
        director: 'Julie Taymor',
    },

    { 
        title: 'Cold War',
        year: '2018',
        director: 'Paweł Pawlikowski',
    },
]

// Creating GET requests for different routes
app.get('/', (req, res) => {
    res.send('Welcome to my movie club!')
});
app.get('/movies', (req, res) => {
    res.json(topMovies)
});

// Creating error-handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

// Listen for requests
app.listen(8080, () => {
    console.log('App is listening on port 8080.');
});