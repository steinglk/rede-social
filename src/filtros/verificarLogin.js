const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');


const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(400).json('Token não informado');
    }


    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, segredo);
        const usuario = await knex('usuarios').where('id', id);
        if(usuario.length === 0) {
            return res.status(400).json('Usuario não encontrado');
        }
        const {senha, ...dadosUsuario} = usuario;

        req.usuario = usuario[0];
        console.log(req.usuario);
        next();
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = verificaLogin;