const mongoose = require('mongoose');
const winston = require('winston');
const express = require('express');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const config = require('config');
const admin = require('./routes/admin');

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use('/admin/', admin);
app.get('/', (req, res) => {
    res.render('index.pug')
});

// check for private key
if(!config.get('jwtPrivateKey')) {
    throw new Error('ERROR: jwtPrivateKey is not defined...');
}

//INIT MONGODB
mongoose.connect(config.get('db'), {useNewUrlParser: true, useCreateIndex: true})
    .then(() => console.log('Connected to MongoDb...'))
    .catch(err => console.log('Error: ', err));

//STARTING SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));

