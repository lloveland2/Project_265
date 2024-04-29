const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const threadRoutes = require('./routes/threadRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://AppManager:YUeJqOr4CXjflFqy@sdev265.66ukqze.mongodb.net/?retryWrites=true&w=majority&appName=SDEV265';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use('/threads', requireAuth, threadRoutes);
app.use(authRoutes);