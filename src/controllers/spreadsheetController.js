const Balance = require('../model/balanceModel');
const Service = require('../model/servicesModel');

const nameMonth = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const totalBalanceDB = (balanceDB) => {
  const totalB = balanceDB.reduce((acc, balance) => {
   const value = balance.expenseValue.replace(',', '.');
   return acc + Number(value);
  }, 0);
  return totalB;
};

const serviceMonth = (serviceDB) => {
  const serviceM = [];
  let currentDate = '';
  let currentValue = 0;
for (let i = 0; i < serviceDB.length; i += 1) {
  if (!currentDate) {
    currentDate = serviceDB[i].date;
    currentValue = Number(serviceDB[i].valueService.replace(',', '.'));
  } else if (serviceDB[i].date === currentDate) {
    currentValue += Number(serviceDB[i].valueService.replace(',', '.'));
  } else {
    serviceM.push({ date: currentDate, value: currentValue.toFixed(2).replace('.', ',') });
    currentDate = serviceDB[i].date;
    currentValue = Number(serviceDB[i].valueService.replace(',', '.'));
  }
}
  serviceM.push({ date: currentDate, value: currentValue.toFixed(2).replace('.', ',') });
  return serviceM;
};

const totalServiceDB = (serviceDB) => {
 const totalS = serviceDB.reduce((acc, service) => {
  const value = service.valueService.replace(',', '.');
  return acc + Number(value);
 }, 0);
 return totalS;
};

const spreadsheetMonthly = async (req, res, next) => {
  try {
    const date = new Date();
    const month = date.getMonth();
    const currentYear = date.getFullYear();
    let currentMonth = '';
        if (month < 9) {
          currentMonth = `0${month + 1}`;
        }
        if (month >= 10) {
          currentMonth = `${month + 1}`;
        }
    const balance = new Balance();
    const service = new Service();
    await balance.findActualBalance();
    const { balanceDB } = balance;
    await service.servicesMonthDB(currentMonth);
    const { serviceDB } = service;
    const totalS = totalServiceDB(serviceDB);
    const serviceM = serviceMonth(serviceDB);
    const totalService = String(totalS.toFixed(2)).replace('.', ',');
    const titleDate = `${nameMonth[month]} de ${currentYear}`;
    const totalB = totalBalanceDB(balanceDB);
    // const balanceM = balanceMonth(balanceDB);
    // console.log(balanceM);
    const totalBalance = String(totalB.toFixed(2)).replace('.', ',');
    const result = totalS - totalB;
    res.render('spreadsheetM', {
      balanceDB, serviceM, totalBalance, totalService, titleDate, result,
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

const spreadsheetMConsult = async (req, res) => {
  try {
    const month = Number(req.body.monthSelect - 1);
    const currentYear = req.body.yearSelect;
    console.log(month, currentYear);
    const currentMonth = req.body.monthSelect;
    const balance = new Balance();
    const service = new Service();
    await balance.find();
    const { balanceDB } = balance;
    await service.servicesMonthDB(currentMonth);
    const { serviceDB } = service;
    const totalS = totalServiceDB(serviceDB);
    const serviceM = serviceMonth(serviceDB);
    const totalService = String(totalS.toFixed(2)).replace('.', ',');
    const titleDate = `${nameMonth[month]} de ${currentYear}`;
    const totalB = totalBalanceDB(balanceDB);
    // const balanceM = balanceMonth(balanceDB);
    // console.log(balanceM);
    console.log(serviceM);
    const totalBalance = String(totalB.toFixed(2)).replace('.', ',');
    const result = totalS - totalB;
    res.render('spreadsheetM', {
      balanceDB, serviceM, totalBalance, totalService, titleDate, result,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = { spreadsheetMonthly, spreadsheetMConsult };