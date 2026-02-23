///// import
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const auth = require('./routes/auth');
const hotel = require('./routes/restaurant');
///// security

//// connect to database
const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();
////routes
app.use('/auth', auth);
//// error handler
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

