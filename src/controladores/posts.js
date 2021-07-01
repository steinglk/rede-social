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
        return res.status(200).json('Postagem feita com sucesso');
    }  
        catch (error) {
            return res.status(400).json(error.message);
    }
}

const atualizarPost = async (req, res) => {
    const {texto, token} = req.body;
    const idPost = req.params.id;
    if(!texto) {
        return res.status(400).json("O campo texto é obrigatório");
    }
    if(!token) {
        return res.status(400).json("O campo token é obrigatório");
    }
    if(!idPost) {
        return res.status(400).json("O id do Post é parametro obrigatório");
    }

    try {
        const { id } = jwt.verify(token, segredo);

        const verificarPostagem = await knex('postagens').where({
            id: idPost,
            usuario_id: id
        });
        if(verificarPostagem.length === 0) {
            return res.status(400).json('Postagem ou usuario não encontrado');
        }
        
        const postagemEditada = await knex('postagens').update('texto', texto).where({id: idPost, usuario_id: id}).returning('texto');
        if(postagemEditada.length === 0){
            return res.status(500).json('Erro ao fazer postagem');
        }
        return res.status(200).json('O texto foi editado com sucesso');
    }  
        catch (error) {
            return res.status(400).json(error.message);
    }
}

module.exports = {
    criarPost,
    atualizarPost
}