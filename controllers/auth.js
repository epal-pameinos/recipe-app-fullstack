const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

exports.getLoginPage = (request, response) => {
  if (request.user) {
    return response.redirect("/profile");
  }
  response.render("login");
};

exports.postLogin = (request, response, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      request.flash("errors", info);
      return response.redirect("/login");
    }
    request.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      request.flash("success", { msg: "Success! You are logged in." });
      response.redirect(request.session.returnTo || "/profile");
    });
  })(request, response, next);
};

exports.getSignupPage = (request, response) => {
  if (request.user) {
    return response.redirect("/profile");
  }
  response.render("signup");
};

exports.postSignup = async (request, response, next) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: request.body.email }, { userName: request.body.userName }],
    });

    if (existingUser) {
      request.flash("errors", {
        msg: "Account with that email address or username already exists.",
      });
      return response.redirect("../signup");
    }

    // Create and save the new user
    const user = new User({
      userName: request.body.userName,
      email: request.body.email,
      password: request.body.password,
    });

    await user.save();

    // Log in the new user
    request.logIn(user, (error) => {
      if (error) return next(error);
      response.redirect("/profile");
    });
  } catch (error) {
    return next(error);
  }
};

exports.logout = (request, response) => {
  request.logout((error) => {
    if (error) {
      console.error("Error during logout:", error);
      return response.status(500).send("Logout failed");
    }
    request.session.destroy((error) => {
      if (error) {
        console.log(
          "Error : Failed to destroy the session during logout.",
          error
        );
      }
      request.user = null;
      response.redirect("/");
    });
  });
};
