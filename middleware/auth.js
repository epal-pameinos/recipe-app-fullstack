module.exports = {
  ensureAuth: function (request, response, next) {
    if (request.isAuthenticated()) {
      return next();
    } else {
      response.redirect("/");
    }
  },
};
