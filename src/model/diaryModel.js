/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */

const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: false,
  },
  startTime: {
    type: String,
    required: true,
    unique: false,
  },
  endTime: {
    type: String,
    required: true,
    unique: false,
  },
  client: {
    type: String,
    required: true,
    unique: false,
  },
  service: {
    type: String,
    required: true,
    unique: false,
  },
}, { timestamps: true });

const DiaryModel = mongoose.model('Diary', DiarySchema);

class Diary {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.success = [];
    this.diary = null;
    this.diaryDB = [];
  }

  async register() {
    this.isValid();
    if (this.errors.length > 0) return;
    this.formatDate();
    this.success.push('Agendamento realizado com sucesso.');
    this.diary = await DiaryModel.create(this.body);
  }

  async edit(id) {
    this.diary = await DiaryModel.find({ _id: id });
    if (!this.diary) {
      this.errors.push('Erro interno do servidor');
    }
  }

  async update(id, body) {
    this.diary = await DiaryModel.findByIdAndUpdate(id, body);
    if (!this.diary) {
      this.errors.push('Erro interno do servidor');
      return;
    }
      this.success.push('Agendamento atualizado com sucesso.');
  }

  isValid() {
    this.verifyString();
    if (!this.body.date) {
      this.errors.push('Digite a data da realização do serviço.');
    }
    if (!this.body.startTime) {
      this.errors.push('Digite o horário final de atendimento.');
    }
    if (!this.body.endTime) {
      this.errors.push('Digite o horário inicial de atendimento.');
    }
    if (!this.body.client) {
      this.errors.push('Digite o nome da cliente.');
    }
    if (!this.body.service) {
      this.errors.push('Digite o serviço.');
    }
  }

  formatDate() {
    const { date } = this.body;
    const onlyNumbersDate = date.replace(/\D/g, '');
    const formatedDate = onlyNumbersDate.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    this.body.date = formatedDate;
  }

  verifyString() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      date: this.body.date,
      startTime: this.body.startTime,
      endTime: this.body.endTime,
      client: this.body.client,
      service: this.body.service,
    };
  }

  async findCurrentDiary(currentDay, currentMonth) {
    this.diaryDB = await DiaryModel.find({ date: new RegExp(`^${currentDay}\\/${currentMonth}\\/\\d{4}$`) }).sort({ startTime: 1 });
      if (this.diaryDB.length === 0) {
        this.errors.push('Não localizei nenhum registro com a data atual.');
      }
    // eslint-disable-next-line no-useless-return
    return;
  }
}

module.exports = Diary;