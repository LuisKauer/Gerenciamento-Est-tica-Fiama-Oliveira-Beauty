
const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  date: {
    type: String,
    require: true,
    unique: false,
  },
  expense: {
    type: String,
    require: true,
    unique: false,
  },
  expenseValue: {
    type: String,
    require: true,
    unique: false,
  },
  description: {
    type: String,
    require: false,
    unique: false,
  },
}, { timestamps: true });

const BalanceModel = mongoose.model('Balance', balanceSchema);

class Balance {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.success = [];
    this.balanceDB = [];
  }

  isValid() {
    const {
      date, expense, description, expenseValue,
    } = this.body;
    if (date.length === 0) {
      this.errors.push('O campo data não pode ser vazio');
    }
    if (date === 'Invalid date') {
      this.errors.push('O data digitada inválida');
    }
    if (expense.length === 0) {
      this.errors.push('O campo despesa não pode estar vazio');
    }
    if (expenseValue.length === 0) {
      this.errors.push('O campo valor não pode estar vazio');
    }

    if (!this.errors) {
      this.body = {
        date,
        expense,
        description,
        expenseValue,
      };
    }
  }

formatDate = () => {
  const { date } = this.body;
    const onlyNumbersDate = date.replace(/\D/g, '');
    const formatedDate = onlyNumbersDate.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    this.body.date = formatedDate;
};

  async register() {
    this.isValid();
    this.formatDate();
    if (this.errors.length === 0) {
      this.balanceDB = await BalanceModel.create(this.body);
      if (this.balanceDB.length === 0) {
        this.errors.push('Registro não realizado');
        return;
      }
      this.success.push('Registro realizado com sucesso');
    }
  }

  async findActualBalance() {
    const date = new Date();
    let month = date.getMonth();
        if (month < 8) {
          month = `0${month + 1}`;
        } else {
          month = String(month + 1);
        }

     this.balanceDB = await BalanceModel.find({ date: new RegExp(`^\\d{2}\\/${month}\\/\\d{4}$`, 'i') }).sort({ date: 1 });
  }

  async edit(id) {
    const balanceRecordDB = await BalanceModel.findOne({ _id: id });
    if (!balanceRecordDB) {
      this.errors.push('Registro não localizado');
    } else {
      this.success.push('Registro localizado com sucesso.');
      this.balanceDB = balanceRecordDB;
    }
  }

  async updateBalance(id, body) {
    const recordUpDB = await BalanceModel.findByIdAndUpdate(id, body);
    if (!recordUpDB) {
      this.errors.push('Registro não localizado');
    } else {
      this.success.push('Registro editado com sucesso.');
    }
  }

  async delete(id) {
    const deleteItem = await BalanceModel.deleteOne({ _id: id });
        if (deleteItem) {
          this.success.push('Registro deletado com sucesso.');
        } else {
          this.errors.push('Registro não localizado ou já deletado');
        }
  }

  async find(currentMonth, currentYear) {
    this.balanceDB = await BalanceModel.find({ date: new RegExp(`^\\d{2}\\/${currentMonth}\\/\\${currentYear}$`, 'i') }).sort({ date: 1 });
  }
}

module.exports = Balance;
