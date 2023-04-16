
const dayWeeks = [
  'D', 'S', 'T', 'Q', 'Q', 'S', 'S',
];

const calendar = (req, res, next) => {
  let currentDay;
  let currentYear;
  let monthIndex;
  if (!req.params.saveDateEjs) {
    const date = new Date();
    currentDay = date.getDate();
    currentYear = date.getFullYear();
    monthIndex = date.getMonth();
  } else {
    currentDay = res.locals.saveDate.day;
    currentYear = res.locals.saveDate.year;
    monthIndex = res.locals.saveDate.month;
  }
  res.locals.dayWeeks = dayWeeks;
  const firstDateNextMonth = new Date(currentYear, monthIndex + 1, 1);
  const numDaysMonth = new Date(firstDateNextMonth - 1).getDate();
  res.locals.firstDayWeekMonth = new Date(currentYear, monthIndex, 1).getDay();
  res.locals.numDaysMonth = numDaysMonth;
  const saveDate = { day: currentDay, month: monthIndex, year: currentYear };
  res.locals.saveDate = saveDate;
  next();
};

const upCalendar = (req, res, next) => {
  try {
    const encodeDate = req.params.saveDateEjs;
    let saveDate = JSON.parse(decodeURIComponent(encodeDate));
    const currentDay = saveDate.day;
    const monthIndex = saveDate.month + 1;
    const currentYear = saveDate.year;
    saveDate = { day: currentDay, month: monthIndex, year: currentYear };
    res.locals.saveDate = saveDate;
    next();
  } catch (err) {
    console.log(err);
  }
};

const downCalendar = (req, res, next) => {
  try {
    const encodeDate = req.params.saveDateEjs;
    let saveDate = JSON.parse(decodeURIComponent(encodeDate));
    const currentDay = saveDate.day;
    const monthIndex = saveDate.month - 1;
    const currentYear = saveDate.year;
    saveDate = { day: currentDay, month: monthIndex, year: currentYear };
    res.locals.saveDate = saveDate;
    next();
  } catch (err) {
    console.log(err);
  }
};

const dayConsultDiary = (req, res, next) => {
  const { day } = req.params;
  const encodeDate = req.params.saveDateEjs;
  let saveDate = JSON.parse(decodeURIComponent(encodeDate));
  const currentDay = day;
  const currentYear = saveDate.year;
  const monthIndex = saveDate.month;
  saveDate = { day: currentDay, month: monthIndex, year: currentYear };
  res.locals.saveDate = saveDate;
  next();
};

module.exports = {
 calendar,
 upCalendar,
 downCalendar,
 dayConsultDiary,
};