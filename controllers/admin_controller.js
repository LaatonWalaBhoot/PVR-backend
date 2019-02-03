const User = require('../models/user');
const City = require('../models/city');
const Theatre = require('../models/theatre');

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

async function createUser(name, email, password, city) {
    return new Promise(async (resolve, reject) => {
        const user = new User({
            name: name,
            email: email,
            password: password,
            city: city,
            isAdmin: true
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