const passportLocalMongoose = require('passport-local-mongoose');
const session        = require('express-session');
const localStrategy         = require('passport-local');
const User                  = require('./models/user');
const bodyParser            = require('body-parser');
const passport              = require('passport');
const mongoose              = require('mongoose');
const express               = require('express');
const mongoDb               = require('mongodb');
const path                  = require('path');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/auth_demo_app', { useMongoClient: true });

// Passport setting up session
app.use(session({
  secret: 'Random secret key I\'ll hopefully have set in an environment variable later',
  resave: false,
  saveUninitialized: false,
}));

// Passport setting up server
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// =================
//      ROUTES
// =================

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/secret', (req, res) => {
  res.render('secret');
});

// =====================
//      AUTH ROUTES
// =====================

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  const newUser = { username: req.body.username, password: req.body.password };
  User.register(new User({ username: newUser.username }), newUser.password, (err, user) => {
    if (err) {
      console.log('Error: ', err);
      return res.render('signup');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/secret');
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/secret',
    failureRedirect: '/login',
  },
), (req, res) => {
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
