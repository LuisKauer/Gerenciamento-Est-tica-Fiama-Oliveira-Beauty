
const Balance = require('../model/balanceModel');

const index = (req, res, next) => {
  res.render('balance');
  next();
};

const registerIndex = (req, res) => {
  res.render('balanceRegister');
};

const register = async (req, res) => {
  try {
    const balance = new Balance(req.body);
    await balance.register();
      if (balance.errors.length > 0) {
        req.flash('errors', balance.errors);
        res.redirect('/balance/registerIndex/');
        return;
      }
    req.flash('success', balance.success);
    res.redirect('/balance/registerIndex/');
} catch (err) {
    console.log(err);
  }
};

const findActualBalance = async (req, res, next) => {
  try {
    let totalMonth = 0;
    const balance = new Balance(req.body);
    await balance.findActualBalance();
    const { balanceDB } = balance;
    balanceDB.forEach((element) => {
      let valueDB = element.expenseValue.replace(',', '.');
      valueDB = Number(valueDB);

      totalMonth += valueDB;
    });
      totalMonth = totalMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const totalMonthFormatted = totalMonth.replace(/\.(\d{2})$/, ',$1');
      res.locals.totalMonth = totalMonthFormatted;
      res.locals.balanceDB = balanceDB;
      next();
  } catch (err) {
    console.log(err);
  }
};

const editBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const balance = new Balance();
    await balance.edit(id);
      if (balance.errors.length > 0) {
      req.flash('errors', balance.errors);
      res.render('balanceRegister');
      }
    res.locals.edit = true;
    res.locals.balanceDB = balance.balanceDB;
    res.render('balanceRegister');
  } catch (err) {
    console.log(err);
  }
};

const updateBalance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const balance = new Balance();
    await balance.updateBalance(id, req.body);
    res.locals.edit = false;
      if (balance.errors.length > 0) {
        req.flash('errors', balance.errors);
        next();
      } else {
        req.flash('success', balance.success);
        next();
      }
  } catch (err) {
    console.log(err);
  }
};

const deleteBalance = async (req, res, next) => {
  try {
    const { id } = req.params;
  const balance = new Balance(req.body);
  await balance.delete(id);
  if (balance.errors.length > 0) {
    req.flash('errors', balance.errors);
    next();
  }
  req.flash('success', balance.success);
  next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  register,
  registerIndex,
  index,
  findActualBalance,
  editBalance,
  deleteBalance,
  updateBalance,
};
