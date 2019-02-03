const User = require('../models/user');
const Movie = require('../models/movie');

async function login(name) {
    return new Promise(async (resolve, reject) => {
        await User.findOne({
            name: name
        }, function (err, user) {
            if(err) {
                reject(err)
            } else if(user) {
                resolve(user)
            } else {
                reject({name: 'Not found', message: `User not found for ${name}`})
            }
        })
    })
}

async function createUser(name, email, password, city, isAdmin) {
    return new Promise(async (resolve, reject) => {
        const user = new User({
            name: name,
            email: email,
            password: password,
            city: city,
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

async function findUsersForMovie(movieName) {
    return new Promise( async(resolve, reject) => {
        await User.find()
            .populate({
                path: 'city',
                populate: {
                    path: 'theatres',
                    populate: {
                        path: 'movies',
                        model: 'Movie',
                        match: {name: movieName}
                    }
                }
            })
            .exec(function (err, docs) {
                if(err) {
                    reject(err)
                } else {
                    resolve(docs)
                }
            })
    })
}



module.exports.login = login;
module.exports.createUser = createUser;
module.exports.findUserByName = findUserByName;
module.exports.findUsersForMovie = findUsersForMovie;
module.exports.getAllMovies = getAllMovies();