/* eslint-disable no-unused-vars */

const { async } = require('regenerator-runtime');
const Services = require('../model/servicesModel');

// controls rendering request record page.searches the database for the current month's records

const index = async (req, res, next) => {
  let total = 0;
  const date = new Date();
  const month = date.getMonth();
  let currentMonth = '';
  if (month < 9) {
   currentMonth = `0${month + 1}`;
  }
  if (month >= 10) {
    currentMonth = `${month + 1}`;
  }
  const servicesModel = new Services();
  await servicesModel.servicesMonthDB(currentMonth);
    if (servicesModel.errors.length > 0) {
      req.flash('errors', servicesModel.errors);
      req.session.save(() => res.render('service'));
      return;
    }
  const services = servicesModel.serviceDB;
  res.locals.services = services;
  for (let i = 0; i < services.length; i += 1) {
    let num = services[i].valueService;
    num = num.replace(',', '.');
    const numFloat = parseFloat(num);
    total += numFloat;
  }
  res.locals.totalMonth = String(total.toFixed(2)).replace('.', ',');

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const year = new Date().getFullYear();
  res.locals.monthVar = `${months[month]} de ${year}`;
  res.render('service');
  next();
};

// controls service registration requests in the database
const register = async (req, res) => {
  try {
  const servicesModel = new Services(req.body);
  await servicesModel.register();
    if (servicesModel.errors.length > 0) {
      req.session.save(() => res.redirect('/service/findServicesIndex/'));
      req.flash('errors', servicesModel.errors);
      return;
    }
    req.flash('success', servicesModel.success);
    res.redirect('/service/');
  } catch (err) {
    console.log(err);
  }
};

// controls service update requests in the database
const editService = async (req, res) => {
  try {
    const { id } = req.params;
    const servicesModel = new Services();
    await servicesModel.edit(id);
    const { service } = servicesModel;
    service.forEach((el) => {
      res.locals.services = el;
    });
    res.render('editService');
  } catch (err) {
    console.log(err);
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const servicesModel = new Services();
    await servicesModel.update(id, req.body);
      if (servicesModel.errors > 0) {
        req.flash('errors', servicesModel.errors);
      }
        req.flash('success', servicesModel.success);
        res.render('service');
  } catch (err) {
      console.log(err);
  }
};

// controls service delete requests in the database
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const servicesModel = new Services();
    await servicesModel.delete(id);
    if (servicesModel.errors > 0) {
      req.flash('errors', servicesModel.errors);
    }
      req.flash('success', servicesModel.success);
      res.redirect('/service/');
  } catch (err) {
    console.log(err);
  }
};

// control request render the search page
const findServicesIndex = async (req, res, next) => {
  res.render('queryDB');
  next();
};

// control search request in database

const findServices = async (req, res) => {
  let total = 0;
  try {
      const servicesModel = new Services(req.body);
      await servicesModel.findServicesDB();
      if (servicesModel.errors.length > 0) {
        req.flash('errors', servicesModel.errors);
        req.session.save(() => res.redirect('/service/'));
        return;
      }
      const services = servicesModel.serviceDB;
      res.locals.services = services;
      for (let i = 0; i < services.length; i += 1) {
        let num = services[i].valueService;
        num = num.replace(',', '.');
        const numFloat = parseFloat(num);
        total += numFloat;
      }
      res.locals.totalMonth = String(total.toFixed(2)).replace('.', ',');

      const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      res.locals.monthVar = `${months[month]} de ${year}`;
      res.render('queryDB');
  } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao obter serviços');
  }
};

module.exports = {
  index,
  register,
  deleteService,
  editService,
  updateService,
  findServicesIndex,
  findServices,
};
