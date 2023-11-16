var express = require("express");
var router = express.Router();
const userModel = require("./users");
//const postModel = require("./post");

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configure Passport to use a local strategy
passport.use(new LocalStrategy(userModel.authenticate()));

// Serialize user into the session
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Express Session middleware
router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
router.use(passport.initialize());
router.use(passport.session());

/* GET home page. */
router.get("/", function (req, res, next) {
res.render("index");
});
router.get("/login", function (req, res, next) {
res.render("login");
});



router.post('/register', async function(req, res, next) {
  var userdata = new userModel({
    username : req.body.username,
    email : req.body.email,
    fullname:req.body.fullname,
    password:req.body.password
  });
  userModel.register(userdata,req.body.password)
  .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  });
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }), function(req, res, next) {});

  router.get('/logout', async function(req, res, next) {
  req.logout(function(err){
    if(err) return next(err);
    res.redirect('/');
  });
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  res.render('profile');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
module.exports = router;
