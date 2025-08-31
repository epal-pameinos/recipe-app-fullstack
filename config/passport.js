const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const mongoose = require("mongoose");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Check if user exists
          const user = await User.findOne({ email: email.toLowerCase() });
          if (!user) {
            return done(null, false, {
              msg: `Email ${email} not registered.`,
            });
          }
          // Check password
          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect password.",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });
};
