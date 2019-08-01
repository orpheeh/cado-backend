const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const userRouter = require('./users/userRouter');
const projectRouter = require('./projects/projectRouter');
const mobileRouter = require('./mobiles/mobileRouter');
const poubelleRouter = require('./poubelles/poubelleRouter');
const unitRouter = require('./unit/unitRouter');

//Connect to DB
mongoose.connect('mongodb://localhost:27017/cado',
	{ useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
mongoose.connection.on('error', () => console.log('Connection with DB fail !'));

//Create app
const app = express();

//First middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', userRouter);
app.use('/api', projectRouter);
app.use('/api', mobileRouter);
app.use('/api', poubelleRouter);
app.use('/api', unitRouter);

app.listen(3002, () => console.log('CADO up 3002 ...'));
