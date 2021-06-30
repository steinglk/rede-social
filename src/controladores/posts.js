const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const criarPost = async (req, res) => {
    const {texto, token} = req.body;
    if(!texto) {
        return res.status(400).json("O campo texto é obrigatório");
    }
    if(!token) {
        return res.status(400).json("O campo token é obrigatório");
    }

    try {
        const { id } = jwt.verify(token, segredo);
        const usuario = await knex('usuarios').where('id', id);
        if(usuario.length === 0) {
            return res.status(400).json('Usuario não encontrado');
        }
        const postUsuario = {
            usuario_id: id,
            texto
        }
        const postagem = await knex('postagens').insert(postUsuario).returning('texto');
        if(postagem.length === 0){
            return res.status(400).json('Erro ao fazer postagem');
        }
        return res.status(200).json(postagem);
    }  
        catch (error) {
            return res.status(400).json(error.message);
    }
}

const atualizarPost = async (req, res) => {

}

module.exports = {
    criarPost,
    atualizarPost
}