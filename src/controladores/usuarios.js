const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const {nome, email, senha} = req.body;

    if(!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }
    if(!email) {
        return res.status(404).json('O campo email é obrigatório');
    }
    if(!email.includes('@')) {
        return res.status(404).json('O email deve ser válido');
    }

    if(!senha) {
        return res.status(404).json('O campo senha é obrigatório');
    }

    try {
        const consultaEmail = await knex('usuarios').where('email', email); 
        console.log(consultaEmail);
        if(consultaEmail.length > 0) {
            return res.status(404).json('Email já cadastrado');
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const cadastro = {
            nome,
            email,
            senha: senhaCriptografada
        }

        const usuarioCadastrado = await knex('usuarios').insert(cadastro).returning(['nome', 'email']);
        
        if(usuarioCadastrado.length > 0) {
            return res.status(400).json('Não foi possível cadastrar usuario');
        }
        
        return res.status(200).json(usuarioCadastrado);

    } catch (error) {
        return res.status(error.message);
    }
}


module.exports = {
    cadastrarUsuario
}