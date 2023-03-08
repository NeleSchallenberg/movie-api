// Importing Express module
const express = require('express');
const app = express();

// Declaring variable for top 10 movies
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
]

// Creating GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my movie club!')
})
app.get('/movies', (req, res) => {
    res.json(topMovies)
})

app.use(express.static('public'));

// Listen for requests
app.listen(8080, () => {
    console.log('App is listening on port 8080.');
});