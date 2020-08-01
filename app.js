const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require('cookie-parser');
const fileRoute = require('./routes/pages');
const authRoute = require('./routes/auth');


dotenv.config({ path: './.env' })

const app = express();


const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'hbs');


// define routes
app.use('/', fileRoute);
app.use('/auth', authRoute);

const port = process.env.PORT || 5000;
app.listen(port , () => { console.log("server started.....") });
//https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions