
const Login = require('../model/loginModel');

// Render page of the login
const index = (req, res) => {
  if (req.session.user) {
   return res.render('service');
  }
  return res.render('login');
};
// Register a new user
const register = async (req, res) => {
  try {
    const login = new Login(req.body);
      await login.register();
        if (login.errors.length > 0) {
          req.session.save(() => res.redirect('/login/'));
          req.flash('errors', login.errors);
          return;
        }
    req.session.save(() => res.redirect('/login/'));
    req.flash('success', login.success);
  } catch (err) {
    console.log(err);
  }
};
// Login in the system
const login = async (req, res) => {
  try {
      const loginDB = new Login(req.body);
      await loginDB.logedDB();
      if (loginDB.errors.length > 0) {
        req.session.save(() => res.redirect('/login/'));
        req.flash('errors', loginDB.errors);
        return;
      }
      req.session.user = loginDB.user;
      res.redirect('/service/');
  } catch (err) {
      console.log(err);
  }
};
// Logout in the system
const logout = async (req, res) => {
  req.session.destroy();
  res.redirect('/login/');
};
// modules exported
module.exports = {
  index,
  register,
  login,
  logout,
};
