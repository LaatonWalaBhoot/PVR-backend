const express = require('express');
const router = express.Router();
const {createToken, verifyToken, sendError} = require('../middlewares/auth');
const {login, createUser} = require('../controllers/admin_controller');

router.post('/login', async (req, res) => {
    await login(req.query.name)
        .then((user) => {
            res.header('x-auth-token', createToken(user._id))
                .status(200)
                .send(user)
        })
        .catch(err => res.status(500).send(err))
});

router.post('signUp', async (req, res) => {
    await createUser(req.query.name, req.query.email, req.query.password, req.query.city)
        .then((user) => {
            res.header('x-auth-token', createToken(user._id))
                .status(200)
                .send(user)
        })
        .catch(err => res.status(500).send(err))
});

router.post('/findUser', async (req, res) => {

});