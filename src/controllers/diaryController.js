/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
const Diary = require('../model/diaryModel');

// global constants and variables
const nameMonth = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const defineDate = () => {
  const date = new Date();
  const day = date.getDate();
  let currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  let currentDay = '';
  const monthIndex = date.getMonth();

    if (day < 10) {
      currentDay = `0${day}`;
    } else {
      currentDay = String(day);
    }
    if (currentMonth < 8) {
      currentMonth = `0${currentMonth + 1}`;
    } else {
      currentMonth = String(currentMonth + 1);
    }
   return [currentDay, currentMonth, currentYear, monthIndex];
};

const index = async (req, res, next) => {
   const [currentDay, currentMonth, currentYear, monthIndex] = defineDate();

  res.locals.dayVar = currentDay;
  res.locals.monthVar = `${nameMonth[monthIndex]} de ${currentYear}`;

  try {
    const diary = new Diary();
    await diary.findCurrentDiary(currentDay, currentMonth);
    if (diary.errors.length > 0) {
      req.flash('errors', diary.errors);
      req.session.save(() => res.render('diaryIndex'));
      return;
    }
  const currentDiary = diary.diaryDB;
      res.locals.diary = currentDiary;
      res.render('diaryIndex');
      next();
  } catch (err) {
      console.log(err);
  }
};

// control schedule and calendar

const scheduleIndex = async (req, res) => {
  let currentDay;
  let monthIndex;
  let currentMonth;
  let currentYear;
try {
  if (!req.params.saveDateEjs) {
    [currentDay, currentMonth, currentYear, monthIndex] = defineDate();
  } else {
      const { saveDate } = res.locals;
      const day = String(saveDate.day);
      if (day < 10) {
        currentDay = `0${day}`;
      } else {
        currentDay = String(day);
      }
      monthIndex = saveDate.month;
      if (monthIndex < 8) {
        currentMonth = `0${monthIndex + 1}`;
      } else {
        currentMonth = String(monthIndex + 1);
      }
      currentYear = saveDate.year;
  }
    const diary = new Diary();

    await diary.findCurrentDiary(currentDay, currentMonth);
      const currentDiary = diary.diaryDB;

      res.locals.diary = currentDiary;
      res.locals.dayVar = currentDay;
      res.locals.monthVar = `${nameMonth[monthIndex]} de ${currentYear}`;
      const saveDate = { day: currentDay, month: monthIndex, year: currentYear };
      const saveDateEjs = encodeURIComponent(JSON.stringify(saveDate));
      res.render('schedule', { saveDateEjs });
  } catch (err) {
    console.log(err);
  }
};

const register = async (req, res) => {
  try {
    const diary = new Diary(req.body);
    await diary.register();
      if (diary.errors.length > 0) {
        req.flash('errors', diary.errors);
        res.redirect('/diary/');
      }
        req.flash('success', diary.success);
        res.redirect('/diary/');
  } catch (err) {
      console.log(err);
  }
};

const editDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const diaryModel = new Diary();
    await diaryModel.edit(id);
    const { diary } = diaryModel;
    diary.forEach((el) => {
      res.locals.diary = el;
    });
      res.render('editDiary');
  } catch (err) {
      console.log(err);
  }
};

const updateDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const diaryModel = new Diary();
    await diaryModel.update(id, req.body);
    if (diaryModel.errors.length > 0) {
      req.flash('errors', diaryModel.errors);
    }
      req.flash('success', diaryModel.success);
      res.redirect('/diary/');
  } catch (err) {
    console.log(err);
  }
};

// controls service delete requests in the database
const deleteDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const diaryModel = new Diary();
    await diaryModel.delete(id);
  res.redirect('/diary/');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  index,
  editDiary,
  updateDiary,
  register,
  scheduleIndex,
};