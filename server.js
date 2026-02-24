///// import

const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const auth = require('./routes/auth');
const restaurant = require('./routes/restaurant');
const reservation = require('./routes/reservation');
const errorHandler = require('./middleware/error');

///// security

//// connect to database
///server.js
const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB();
////routes
app.use('/auth', auth);
app.use('/restaurant', restaurant);
app.use('/reservation', reservation);
//// error handler
app.use(errorHandler);
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

