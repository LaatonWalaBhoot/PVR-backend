const express = require('express');
const router = express.Router();
const {createToken, verifyToken, sendError} = require('../middlewares/auth');
const genPassword = require('../middlewares/password');
const {
    login,
    createUser,
    getAllMovies,
    getAllCities,
    findUserByName,
    findUsersForMovie,
    createCity,
    createMovie,
    createTheatre,
    addMovieToTheatre,
    addTheatreToCity,
    sendEmail
} = require('../controllers/admin_controller');

//POST REQUESTS
router.post('/login', async (req, res) => {
    await login(req.query.name, req.query.password)
        .then((user) => {
            res.header('x-auth-token', createToken(user._id, true))
                .status(200)
                .send(user)
        })
        .catch(err => res.status(500).send(sendError(true, err.name, err.message)))
});

router.post('/signUp', genPassword,async (req, res) => {
    await createUser(req.query.name, req.query.email, req.query.password, req.query.city, true)
        .then((user) => {
            res.header('x-auth-token', createToken(user._id, true))
                .status(200)
                .send(user)
        })
        .catch(err => res.status(500).send(sendError(true, err.name, err.message)))
});

router.post('/createUser', verifyToken,async (req, res) => {
    await createUser(req.query.name, req.query.email, req.query.password, req.query.city, false)
        .then((user) => {
            res.status(200).send(user)
        }).catch(err => res.status(500).send(sendError(true, err.name, err.message)))
});

router.post('/sendEmailForUser', verifyToken,async (req, res) => {
    await sendEmail(req.body.to, req.body.from, req.body.subject, req.body.text)
        .then((result) => res.status(200).send(result.statusMessage))
        .catch(err => res.status(500).send(sendError(true, err.name, err.message)))
});

router.post('/sendEmailForMovie', verifyToken,async (req, res) => {
    await findUsersForMovie(req.body.movieName, req.body.from, req.body.subject, req.body.text)
        .then((result) => res.status(200).send(result))
        .catch(err => res.status(500).send(sendError(true, err.name, err.message)))
});

//GET REQUESTS
router.get('/getUser', verifyToken ,async (req, res) => {
    await findUserByName(req.query.name)
        .then((user) => res.status(200).send(user))
        .catch(err => res.status(500).send(sendError(true, err.name, err.message)))
});

router.get('/getAllMovies', async (req, res) => {
    const movies = await getAllMovies();
    res.status(200).send(movies);
});

router.get('/getAllCities', async (req, res) => {
    const cities = await getAllCities();
    res.status(200).send(cities);
});


//UTILITY REQUESTS
router.post('/createMovie', async (req, res) => {
    const movie = await createMovie(req.query.name);
    res.status(200).send(movie);
});

router.post('/createCity', async (req, res) => {
    const city = await createCity(req.query.name);
    res.status(200).send(city);
});

router.post('/createTheatre', async (req, res) => {
    const theatre = await createTheatre(req.query.name);
    res.status(200).send(theatre);
});

router.post('/addMovieToTheatre', async (req, res) => {
    const result = await addMovieToTheatre(req.query.movieId, req.query.theatreId);
    res.status(200).send(result);
});

router.post('/addTheatreToCity', async (req, res) => {
    const result = await addTheatreToCity(req.query.theatreId, req.query.cityId);
    res.status(200).send(result);
});

module.exports = router;