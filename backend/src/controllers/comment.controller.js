import models from "../models/index.js"

export const getAllComments = async (req, res) => {
    try {
        const comments = await models.Comment.findAll({
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

export const createComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { postId } = req.params;
        const userId = req.user.id;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "El comentario no puede estar vacío"
      });
    }

    const comment = await models.Comment.create({
      text,
      userId,
      postId
    });
        res.status(201).json(comment)
    }
    catch(error) {
        message: "Error al crear comentario"
        res.status(500).json({error: error.message})
    }
}

export const updateComment = async (req, res) => {
    try{
        const {
            text
        } = req.body
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

export const likeComment = async (req, res) => {
  try {
    const comment = await models.Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        error: "No se pudo encontrar el comentario"
      });
    }

    comment.likeCount += 1;

    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({
      message: "Error al likear comentario",
      error: error.message
    });
  }
};