const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (e) => {
        if (e) return next(e);
        req.flash("success", "Welcome to Yelp Camp!");
        return res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      return res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((e) => {
    if (e) {
      return next(e);
    }
    req.flash("success", "Goodbye!");
    return res.redirect("/campgrounds");
  });
});

module.exports = router;
