const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan'); // HTTP request logger middleware
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const keys = require('./config/keys');
const app = express();


// connection to database
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })
  .then(() => console.log('MongoDB connected.'))
  .catch(error => console.log('ERROR by MongoDB connection:', error));

// add passport.js
app.use(passport.initialize());
require('./middleware/passport')(passport);

// for HTTP request logging
app.use(morgan('dev'));

// for the Express, to parsing the req.body properties as JS-objects
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// CORS
app.use(cors());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);


module.exports = app;
