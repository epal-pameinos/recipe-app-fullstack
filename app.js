const express = require("express");
const app = express();

const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

const MongoStore = require("connect-mongo");

const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");

const connectDB = require("./config/database");

const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");

// Load environment variables
require("dotenv").config({ path: "./config/.env" });

require("./config/passport")(passport);

// Connect To Database
connectDB();

// using EJS as the templating engine
app.set("view engine", "ejs");

// Static Files
app.use(express.static("public"));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
app.use(logger("dev"));

// Use forms for put / delete
app.use(methodOverride("_method"));

// Sessions stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages for errors, information, etc.
app.use(flash());

// routes
app.use("/api", mainRoutes);
app.use("/post", postRoutes);

// server listening
app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT}, you betta catch it!`
  );
});
