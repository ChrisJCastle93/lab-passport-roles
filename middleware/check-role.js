const passport = require("passport");
const User = require("../models/User.model");

// const passportAuth = passport.authenticate("local", {
//     failureRedirect: "/signin",
//   });

const isBoss = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/signin");
  }
  User.findOne({ username: req.session.currentUser.username })
    .then((user) => {
      if (user.role !== "BOSS") {
        console.log("no permissions");
        return res.redirect("/");
      }
      next();
    })
    .catch((err) => console.log(err));
};

module.exports = {
//   passportAuth,
  isBoss
};
