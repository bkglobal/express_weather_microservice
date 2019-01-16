const express = require('express');
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const body_parser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const configuration = require('./config/database');

const app = express();
const routes = app.routes;
const port = process.env.port || 80;
app.listen(port , () => {
    // res.send('working');
});

mongoose.connect(configuration.database,{ useNewUrlParser: true });
mongoose.connection.on('connected', (res)=>{
    console.log('mongoose connected');
});
mongoose.connection.on('error',(res)=>{
    console.log('error connecting');
})


app.use(body_parser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(app.router);
// routes.initialize(app);
app.use(passport.initialize());
app.use(passport.session());

const weather = require(path.join(__dirname+'/routes/getWeather'));

app.use('/weather', weather);


app.get('/',(req, res)=>{
    res.send('working');
})