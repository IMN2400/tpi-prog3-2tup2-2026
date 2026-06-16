import models from "../models/index.js"

export const getAllComments = async (req, res) => {
    try {
        const comments = await models.comments.findAll({
            include:[
                models.Person,
                models.Post
            ]
        })
        res.json(comments)
    }
    catch(error) {
        message: "Error al buscar comentario"
        res.status(500).json({error: error.message})
    }
}

export const getCommentById = async (req, res) => {
    try {
        const comment = await models.Comment.findByPk(req.params.id, {
            include:[
                models.Person,
                models.Post
            ]
        })
        if (!comment) {
            return res.status(404).json({
                error: "No se pudo encontrar el comentario"
            })
        }
        res.json(comment)
    }
    catch(error) {
        message: "Error al buscar comentario"
        res.status(500).json({error: error.message})
    }
}

export const getCommentsByPost = async (req, res) =>{
    try{
        const comments = await models.Comment.findAll({
            where: {
                postId: req.params.postId
            },
            include: [
                models.Person
            ]
        })
        res.json(comments)
    }
    catch(error) {
        message: "Error al buscar comentario"
        res.status(500).json({error: error.message})
    }
}

export const createCommet = async (req, res) => {
    try {
        const {
            text,
            personId,
            postId,
        } = req.body

        const comment = await models.Comment.create({
            text,
            personId,
            postId
        })
        res.status(201).json(comment)
    }
    catch(error) {
        message: "Error al crear comentario"
        res.status(500).json({error: error.message})
    }
}

export const updateCommet = async (req, res) => {
    try{
        const {
            text
        } = req.boy
        const comment = await models.Comment.findByPk(req.params.id)

        if (!comment) {
            return res.status(404).json ({
                error: "No se pudo encontrar el comentario"
            })
        }
        await comment.update({
            text
        })
        res.json(comment)
    }
    catch(error) {
        message: "Error al actualizar comentario"
        res.status(500).json({error: error.message})
    }
}

export const deleteComment = async (req, res) => {
    try{
        const comment = await models.Comment.findByPk(req.params.id)

        if (!comment) {
            return res.status(404).json ({
                error: "No se pudo encontrar el comentario"
            })
        }
        await comment.destroy()
        res.json ({
            message: "comentario eliminado"
        })

    } 
    catch(error) {
        message: "Error al actualizar comentario"
        res.status(500).json({error: error.message})
    }
}

export const likesPost = async (req, res) => {
    try {
        const comment = await models.Comment.findByPk(req.params.id)

        if (!comment){
            return res.status(404).json ({
                error: "No puso encontrar el comentario"
            })
        }
        post.likeCount += 1
        await commnet.save()
        res.json(post)
    }
    catch (error) {
        message: "Error al likear post"
        res.status(500).json({error: error.message})
    }
}