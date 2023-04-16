/* eslint-disable no-restricted-syntax */
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const LoginModel = mongoose.model('login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.success = [];
    this.user = null;
  }

  async logedDB() {
    this.isValid();
    // eslint-disable-next-line no-useless-return
    if (this.errors.length > 0) return;
      this.user = await LoginModel.findOne({ email: this.body.email });
    if (!this.user) {
      this.errors.push('Usuário inexistente');
      return;
    }
    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha incorreta');
      this.user = null;
    }
  }

  async register() {
    this.isValid();
    // eslint-disable-next-line no-useless-return
    if (this.errors.length > 0) return;

      await this.userCheckDB();

      const salt = bcryptjs.genSaltSync();
      this.body.password = bcryptjs.hashSync(this.body.password, salt);
      this.success = 'Cadastro criado com sucesso';
      this.user = await LoginModel.create(this.body);
  }

  async userCheckDB() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push('Já existe usuário com este Email, faça o login ou escolha outro email.');
  }

  isValid() {
    this.verifyString();
    if (!validator.isEmail(this.body.email)) {
      this.errors.push('Digite um email válido.');
    }
    if (this.body.password.length < 3 || this.body.password.length > 20) {
      this.errors.push('Digite uma senha válida, precisa ter entre 3 e 20 caracteres.');
    }
  }

  verifyString() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;