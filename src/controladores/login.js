const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');


const login = async (req, res) => {
    const {email, senha} = req.body;

    if(!email || !senha) {
        return res.status(403).json("Email e senha são obrigatórios");
    }
    try {
        const verificarEmail = await  knex('usuarios').where('email', email);
        if(verificarEmail.length === 0) {
            return res.status(404).json('Email ou senha incorretos');
        }
        const usuario = verificarEmail[0];
        
        const verificarSenha = await bcrypt.compare(senha, usuario.senha);

        if(!verificarSenha) {
            return res.status(404).json('Email ou senha incorretos'); 
        }

        const token = jwt.sign({ id: usuario.id }, segredo, {expiresIn: '1d'});
        const {senha: senhaUsuario, ...dadosUsuario} = usuario;
        return res.status(200).json({
            usuario: dadosUsuario,
            token});
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = login;