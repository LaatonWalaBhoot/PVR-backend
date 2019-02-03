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

