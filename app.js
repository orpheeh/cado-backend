const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const userRouter = require('./users/userRouter');
const projectRouter = require('./projects/projectRouter');
const mobileRouter = require('./mobiles/mobileRouter');
const poubelleRouter = require('./poubelles/poubelleRouter');
const unitRouter = require('./unit/unitRouter');
const dispositifRouter = require('./dispositifs/dispositifRouter');

//Connect to DB
mongoose.connect('mongodb://localhost:27017/cado',
	{ useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
mongoose.connection.on('error', () => console.log('Connection with DB fail !'));

//Create app
const app = express();

//First middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Get image
app.get('/images/acc/:filename', (req, res) => {
	console.log('Get image please');
	res.sendFile(__dirname + '/projects/images/' + req.params.filename);
});

app.use('/api', userRouter);
app.use('/api', projectRouter);
app.use('/api', mobileRouter);
app.use('/api', poubelleRouter);
app.use('/api', unitRouter);
app.use('/api', dispositifRouter);

const port = 3000;
app.listen(port, () => console.log(`CADO up ${port} ...`));
