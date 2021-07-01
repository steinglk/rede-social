const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const criarPost = async (req, res) => {
    const {texto} = req.body;
    const {usuario} = req;
    if(!texto) {
        return res.status(400).json("O campo texto é obrigatório");
    }

    try {
        
        const postUsuario = {
            usuario_id: usuario.id,
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
    const {texto} = req.body;
    const {usuario} = req;

    const idPost = req.params.id;
    if(!texto) {
        return res.status(400).json("O campo texto é obrigatório");
    }
    if(!idPost) {
        return res.status(400).json("O id do Post é parametro obrigatório");
    }

    try {
        
        const postagemEditada = await knex('postagens').update('texto', texto).where({id: idPost, usuario_id: usuario.id}).returning('texto');
        if(postagemEditada.length === 0){
            return res.status(500).json('Erro ao fazer postagem');
        }
        return res.status(200).json('O texto foi editado com sucesso');
    }  
        catch (error) {
            return res.status(400).json(error.message);
    }
}

const deletarPost = async (req, res) => {
    const idPost = req.params.id;
    const {usuario} = req

    if(!idPost) {
        return res.status(400).json("O id do Post é parametro obrigatório");
    }

    try {
        const postRemovido = await knex('postagens').where({id: idPost, usuario_id: usuario.id}).delete('*').debug();
        if(postRemovido.length === 0) {
            return res.status(400).json('Falha ao excluir postagem');
        }
        
        return res.status(200).json(postRemovido);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

/* const listarPosts = async (req, res) => {

} */

module.exports = {
    criarPost,
    atualizarPost,
    deletarPost
}