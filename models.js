const mongoose = require('mongoose');

// Defining schema for movies
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Year: {type: String},
    Length: {type: String},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: String
    },
    Actors: [String],
    ImagePath: String,
});

// Defining schema for users
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.String, ref: 'Movie'}]
});

// Creating models to USE schemas
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// Exporting models (in order to import them into index.js)
module.exports.Movie = Movie;
module.exports.User = User;