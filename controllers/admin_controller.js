const User = require('../models/user');
const Movie = require('../models/movie');
const City = require('../models/city');
const Theatre = require('../models/theatre');
const config = require('config');
const sgMail = require('@sendgrid/mail');

async function login(name, password) {
    return new Promise(async (resolve, reject) => {
        await User.findOne({
            name: name
        },async function (err, user) {
            if(err) {
                reject(err)
            } else if(user) {
                if(password === user.password) {
                    if(user.isAdmin) {
                        resolve(user)
                    } else {
                        reject({name: 'Not Authorised', message: `You don't have administrator rights`})
                    }
                } else {
                    reject({name: 'Authentication Failure', message: `Incorrect Password`})
                }
            } else {
                reject({name: 'Not found', message: `User not found for ${name}`})
            }
        })
    })
}

async function createUser(name, email, password, cityId, isAdmin) {
    return new Promise(async (resolve, reject) => {
        const user = new User({
            name: name,
            email: email,
            password: password,
            city: cityId,
            isAdmin: isAdmin
        });

        await user.save(function (err, user) {
            if(err) {
                reject(err)
            } else if(user) {
                resolve(user)
            } else {
                reject({name: 'Unknown Error', message: 'Some unknown error occurred'})
            }
        })
    })
}

async function findUserByName(name) {
    return new Promise(async (resolve, reject) => {
        await User.findOne({name: name}, function (err, user) {
            if(err) {
                reject(err)
            } else if(user) {
                resolve(user)
            } else {
                reject({name: 'Not found', message: `Cannot find any user for ${name}`})
            }
        })
    })
}

async function getAllMovies() {
    return await Movie.find();
}

async function getAllCities() {
    return await City.find();
}

async function findUsersForMovie(movieName, from , subject, text) {
    return new Promise( async(resolve, reject) => {
        await User.find({})
            .populate({
                path: 'city',
                populate: {
                    path: 'theatres',
                    select: 'theatres -_id',
                    populate: {
                        path: 'movies',
                        select: 'name -_id',
                        model: 'Movie',
                        match: {name: movieName}
                    }
                }
            })
            .exec(function (err, docs) {
                if(err) {
                    reject(err)
                } else {
                    docs.filter(function (doc) {
                        doc.city.theatres.filter(async function (theatre) {
                            if(theatre.movies.length > 0) {
                                await sendEmail(doc.email, from, subject, text)
                            }
                        });
                    });
                    resolve('Success')
                }
            })
    })
}


//UTILITY METHODS FOR DUMMY DATA
async function createMovie(name) {
    const movie = new Movie({
        name: name
    });

    return await movie.save()
}

async function createCity(name) {
    const city = new City({
        name: name
    });

    return await city.save()
}

async function createTheatre(theatreName) {
    const theatre = new Theatre({
        name: theatreName,
        movies: []
    });

    return await theatre.save()
}

async function addMovieToTheatre(movieId, theatreId) {
    const movie = await Movie.findById(movieId);
    const theatre = await Theatre.findById(theatreId);
    theatre.movies.push(movie);
    return await theatre.save();
}

async function addTheatreToCity(theatreId, cityId) {
    const theatre = await Theatre.findById(theatreId);
    const city = await City.findById(cityId);
    city.theatres.push(theatre);
    return await city.save();
}


//EMAIL CONFIGURATION
async function sendEmail(to, from, subject, text) {
    sgMail.setApiKey(config.get('email_key').toString());
    const msg = {
        to: to,
        from: from,
        subject: subject,
        text: text,
    };
    return sgMail.send(msg)
}


module.exports.login = login;
module.exports.createUser = createUser;
module.exports.findUserByName = findUserByName;
module.exports.findUsersForMovie = findUsersForMovie;
module.exports.getAllMovies = getAllMovies;
module.exports.getAllCities = getAllCities;
module.exports.createMovie = createMovie;
module.exports.createCity = createCity;
module.exports.createTheatre = createTheatre;
module.exports.addMovieToTheatre = addMovieToTheatre;
module.exports.addTheatreToCity = addTheatreToCity;
module.exports.sendEmail = sendEmail;