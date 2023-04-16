/* eslint-disable import/extensions */
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const session = require('express-session');

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const routes = require('./routes.js');
const {
 csrfMiddleware, checkCsrfError, localVariables, localsCalendar,
} = require('./src/middlewares/middleware');

const app = express();
mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONECCTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.emit('Conectado');
}).catch((e) => console.log(e));

app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(path.resolve(__dirname, 'frontend', 'assets', 'css')));
app.use('/images', express.static(path.resolve(__dirname, 'src', 'images')));
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

const sessionOptions = {
  secret: 'fiama',
  store: MongoStore.create({ mongoUrl: process.env.CONECCTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Midlewares
app.use(csrfMiddleware);
app.use(checkCsrfError);
app.use(localVariables);
app.use(localsCalendar);

// Routes
app.use(routes);

const port = 3000;

app.on('Conectado', () => {
  app.listen(port, () => {
    console.log(`Acessar http://localhost:${port}`);
    console.log(`Servidor executando na porta ${port}`);
  });
});
