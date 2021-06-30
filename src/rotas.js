const express = require('express');
const usuarios = require('./controladores/usuarios');

const rotas = express();

rotas.post('/', usuarios.cadastrarUsuario );

module.exports = rotas;
