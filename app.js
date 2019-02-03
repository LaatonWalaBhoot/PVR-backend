const mongoose = require('mongoose');
const winston = require('winston');
const express = require('express');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const config = require('config');

app.use(express.json());
app.use(helmet());
app.use(compression());

mongoose.connect(config.get('db'), {useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDb...'))
    .catch(err => console.log('Error: ', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));

