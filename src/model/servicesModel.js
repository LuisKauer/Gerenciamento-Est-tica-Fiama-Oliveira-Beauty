/* eslint-disable no-restricted-syntax */

const mongoose = require('mongoose');

const ServicesSchema = new mongoose.Schema({
  date: {
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
  valueService: {
    type: String,
    required: true,
    unique: false,
  },
}, { timestamps: true });

const ServicesModel = mongoose.model('services', ServicesSchema);

class Services {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.success = [];
    this.service = null;
    this.serviceDB = [];
  }

  async register() {
    this.isValid();
    if (this.errors.length > 0) return;
    this.formatDate();
    this.success.push('Serviço registrado com sucesso.');
    this.service = await ServicesModel.create(this.body);
  }

  async edit(id) {
    this.service = await ServicesModel.find({ _id: id });
    if (!this.service) {
      this.errors.push('Erro interno do servidor do banco de dados');
    }
  }

  async update(id, body) {
    this.service = await ServicesModel.findByIdAndUpdate(id, body);
    if (!this.service) {
      this.errors.push('Erro interno do servidor do banco de dados');
      return;
    }
      this.success.push('Registro atualizado com sucesso.');
  }

  async delete(id) {
    this.service = await ServicesModel.findByIdAndDelete({ _id: id });
    if (!this.service) {
      this.errors.push('Erro interno do servidor do banco de dados');
    }
      this.success.push('Registro deletado com sucesso.');
  }

  isValid() {
    this.verifyString();
    if (!this.body.date) {
      this.errors.push('Digite a data da realização do serviço.');
    }
    if (!this.body.client) {
      this.errors.push('Digite o o nome da cliente.');
    }
    if (!this.body.service) {
      this.errors.push('Digite o serviço.');
    }
    if (!this.body.valueService) {
      this.errors.push('Digite o valor do serviço.');
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
      client: this.body.client,
      service: this.body.service,
      valueService: this.body.valueService,
    };
  }

  async servicesMonthDB(currentMonth) {
    this.serviceDB = await ServicesModel.find({ date: new RegExp(`^\\d{2}\\/${currentMonth}\\/\\d{4}$`, 'i') }).sort({ date: 1 });
      if (this.serviceDB.length === 0) {
        this.errors.push('Não localizei nenhum registro com o mês atual informado.');
      }
    // eslint-disable-next-line no-useless-return
    return;
  }

  async findServicesDB() {
    if (this.body.date.length > 0 && this.body.date.length <= 2) {
      const month = parseInt(this.body.date, 10);
      let currentMonth = '';
      if (month < 10) {
      currentMonth = `0${month}`;
      }
      if (month >= 10) {
      currentMonth = `${month}`;
      }
      this.serviceDB = await ServicesModel.find({ date: new RegExp(`^\\d{2}\\/${currentMonth}\\/\\d{4}$`, 'i') }).sort({ date: 1 });
      if (this.serviceDB.length === 0) {
        this.errors.push('Não localizei nenhum registro com a data ou o mês informado.');
      }
      return;
    }
    if (this.body.date.length > 2) {
      this.formatDate();
      this.serviceDB = await ServicesModel.find({ date: this.body.date }).sort({ date: 1 });
      if (this.serviceDB.length === 0) {
        this.errors.push('Não localizei nenhum registro com a data ou o mês informado.');
      }
      return;
    }
    if (this.body.client) {
      this.serviceDB = await ServicesModel.find({ client: this.body.client }).sort({ date: 1 });
      if (this.serviceDB.length === 0) {
        this.errors.push('Não localizei nenhum registro para a cliente informada.');
      }
      return;
    }
    if (this.body.service) {
      this.serviceDB = await ServicesModel.find({ service: this.body.service }).sort({ date: 1 });
      if (this.serviceDB.length === 0) {
        this.errors.push('Não localizei nenhum registro para o serviço informado.');
      }
      // eslint-disable-next-line no-useless-return
      return;
    }
    this.errors.push('Nenhum critério de pesquisa foi digitado.');
  }

  async find() {
    this.serviceDB = await ServicesModel.find();
  }
}

module.exports = Services;