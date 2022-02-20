const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
/* GET home page */

router.get("/", (req, res, next) => {
  console.log('HIT INDEX ROUTE')
  console.log(req.session.currentUser)
  User.find()
    .then((users) => {
      console.log('finding users...')
      if (req.session.currentUser) {
        if (req.session.currentUser.role == "BOSS") {
          console.log("IS BOSS");
          return res.render("index", {
            userInSession: req.session.currentUser,
            users: users,
            boss: "TRUE",
          });
        } else {
          console.log("IS NOT A BOSS");
          return res.render("index", {
            userInSession: req.session.currentUser,
            users: users,
          });
        }
      } else {
        console.log('NO USER CURRENTLY LOGGED IN')
        res.render("index", {
          users: users,
        });
      }
    })
    .catch((err) => console.log(err));
});
module.exports = router;
