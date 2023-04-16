/* eslint-disable object-curly-newline */
const express = require('express');

const route = express.Router();

const servicesController = require('./src/controllers/servicesController');
const loginController = require('./src/controllers/loginController');
const homeController = require('./src/controllers/homeController');
const diaryController = require('./src/controllers/diaryController');
const { index, register, registerIndex, findActualBalance, editBalance, deleteBalance, updateBalance } = require('./src/controllers/balanceController');
const { loginRequired } = require('./src/middlewares/middleware');

const { spreadsheetMonthly, spreadsheetMConsult } = require('./src/controllers/spreadsheetController');
const { invoicingIndex } = require('./src/controllers/invoicingController');
const { calendar, upCalendar, downCalendar, dayConsultDiary } = require('./src/controllers/calendarController');

// Home Routes
route.get('/', homeController.index);

// Login Routes
route.get('/login/', loginController.index);
route.post('/login/login', loginController.login);
route.post('/login/register', loginController.register);
route.get('/login/logout', loginController.logout);

// Services Routes
route.get('/service/', loginRequired, servicesController.index);
route.post('/service/register/', loginRequired, servicesController.register);
route.get('/service/findServicesIndex/', loginRequired, servicesController.findServicesIndex);
route.post('/service/findServices', loginRequired, servicesController.findServices);
route.get('/service/delete/:id', loginRequired, servicesController.deleteService);
route.get('/service/edit/:id', loginRequired, servicesController.editService);
route.post('/service/update/:id', loginRequired, servicesController.updateService);

// Diary Routes
route.get('/diary/', loginRequired, diaryController.index);
route.post('/diary/register/', loginRequired, diaryController.register);
route.get('/diary/edit/:id', loginRequired, diaryController.editDiary);
route.post('/diary/update/:id', loginRequired, diaryController.updateDiary);
route.get('/diary/index/', loginRequired, calendar, diaryController.scheduleIndex);
route.get('/diary/index/up/:saveDateEjs', loginRequired, upCalendar, calendar, diaryController.scheduleIndex);
route.get('/diary/index/down/:saveDateEjs', loginRequired, downCalendar, calendar, diaryController.scheduleIndex);
route.get('/diary/day/:day/:saveDateEjs', loginRequired, dayConsultDiary, calendar, diaryController.scheduleIndex);

// Balance Routes
route.get('/balance/', loginRequired, index);
route.get('/balance/registerIndex/', loginRequired, findActualBalance, registerIndex);
route.post('/balance/register/', loginRequired, findActualBalance, register);
route.get('/balance/edit/:id', loginRequired, editBalance, registerIndex);
route.get('/balance/delete/:id', loginRequired, deleteBalance, findActualBalance, registerIndex);
route.post('/balance/update/:id', loginRequired, updateBalance, findActualBalance, registerIndex);

// Invoicing Routes

route.get('/invoicing/', loginRequired, invoicingIndex);
route.get('/invoicing/monthly/', loginRequired, spreadsheetMonthly);
route.post('/invoicing/monthlyConsult/', loginRequired, spreadsheetMConsult);
route.get('/invoicing/yearly/', loginRequired, index);

// Spreadsheet Routes

route.get('/spreadsheet/monthly/', loginRequired, spreadsheetMonthly);

module.exports = route;
