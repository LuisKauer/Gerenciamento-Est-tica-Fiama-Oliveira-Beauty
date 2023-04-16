
const localVariables = (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  res.locals.services = [];
  res.locals.monthVar = '';
  res.locals.dayVar = '';
  res.locals.totalMonth = 0;
  res.locals.diary = [];
  res.locals.balanceDB = [];
  res.locals.edit = false;
  next();
};

const localsCalendar = (req, res, next) => {
  res.locals.dayWeeks = [];
  res.locals.firstDayWeekMonth = 0;
  res.locals.numDaysMonth = 0;
  res.locals.dayMonth = 1;
  res.locals.saveDate = {};
  next();
};

// eslint-disable-next-line consistent-return
const checkCsrfError = (err, req, res, next) => {
  if (err) {
    console.log(err);
    return res.render('erroCsrf');
  }
  next();
};

const csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

const loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', 'Para acessar esta página, faça o login.');
    req.session.save(res.redirect('/login/'));
    return;
  }
  next();
};

module.exports = {
  checkCsrfError,
  csrfMiddleware,
  localVariables,
  loginRequired,
  localsCalendar,
};