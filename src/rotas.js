const express = require('express');
const usuarios = require('./controladores/usuarios');
const posts = require('./controladores/posts');
const login = require('./controladores/login');

const rotas = express();

rotas.post('/usuarios', usuarios.cadastrarUsuario );

rotas.get('/login', login);


rotas.post('/postagens', posts.criarPost);
rotas.patch('/postagens/:id', posts.atualizarPost);


module.exports = rotas;
