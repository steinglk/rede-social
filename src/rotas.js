const express = require('express');
const usuarios = require('./controladores/usuarios');
const posts = require('./controladores/posts');
const login = require('./controladores/login');
const verificaLogin = require('./filtros/verificarLogin')

const rotas = express();

rotas.post('/usuarios', usuarios.cadastrarUsuario );

rotas.get('/login', login);

rotas.use(verificaLogin);

rotas.post('/postagens', posts.criarPost);
rotas.patch('/postagens/:id', posts.atualizarPost);
rotas.delete('/postagens/:id', posts.deletarPost);


module.exports = rotas;
