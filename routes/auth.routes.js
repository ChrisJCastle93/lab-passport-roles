const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");
const User = require("../models/User.model");
const passport = require("passport");
// const { isBoss, passportAuth } = require("../middleware/check-role");
const { isBoss } = require("../middleware/check-role");

router.get("/signup", (req, res, next) =>
  res.render("auth/signup", { layout: false })
);

router.post("/signup", (req, res, next) => {
  const { username, password, name, pic, description, role } = req.body;
  if (!username || !password || !name || !pic || !description || !role) {
    return res.render("auth/signup", {
      errorMessage: "include all information",
    });
  }
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((password) => {
      return User.create({
        username,
        profileImg: pic,
        name,
        password,
        description,
        role,
      });
    })
    .then((user) => {
      console.log("NEW USER CREATED:", user);
      res.redirect("/");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(400).render("auth/signup", {
          errorMessage: `${error.keyValue.username} is already taken`,
        });
      } else {
        next(error);
      }
    });
});

router.get("/users/add", isBoss, (req, res, next) =>
  res.render("adduser", { layout: false })
);

router.get("/users/:id/delete", isBoss, (req, res, next) => {
  // console.log(req.params)
  const { id } = req.params;
  User.findOneAndDelete(id).then((user) => {
    res.redirect('/')
    console.log(user.username, 'deleted')
  }).catch(err => console.log(err))
});

router.post("/users/add", isBoss, (req, res, next) => {
  const { username, password, name, pic, description, role } = req.body;
  if (!username || !password || !name || !pic || !description || !role) {
    return res.render("auth/signup", {
      errorMessage: "include all information",
    });
  }
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((password) => {
      return User.create({
        username,
        profileImg: pic,
        name,
        password,
        description,
        role,
      });
    })
    .then((user) => {
      console.log("NEW USER CREATED:", user);
      res.redirect("/");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(400).render("auth/signup", {
          errorMessage: `${error.keyValue.username} is already taken`,
        });
      } else {
        next(error);
      }
    });
});

router.get("/signin", (req, res, next) =>
  res.render("auth/signin", { layout: false, })
);

// const passportAuth = passport.authenticate("local", {
//   failureRedirect: "/signin",
//   failureFlash: true 
// });

// router.post("/signin", passportAuth, (req, res, next) => {
//   console.log('signin route accessed')
//   req.session.currentUser = req.user;
//   res.redirect("/");
// });

router.post('/signin', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      return res.render('auth/signin', { layout: false, errorMessage: info.errorMessage })
    }
    req.logIn(user, function(err) {
      // console.log('passport logged in. User:', user)
      req.session.currentUser = user;
      console.log('REQ.SESSION.CURRENTUSER:', user.username)
      console.log('redirecting..')
      res.redirect('/')
      if (err) { 
        return next(err); 
      }
    });
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(err);
    }
    res.redirect("/");
  });
});

router.get("/boss", isBoss, (req, res, next) => res.render("private"));

module.exports = router;
