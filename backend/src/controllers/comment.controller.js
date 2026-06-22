import models from "../models/index.js"
import { Op } from "sequelize";

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

export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await models.Comment.findAll({
      where: {
        postId: req.params.postId,
      },
      include: [
        models.Person,
      ],
      order: [["postDate", "ASC"]],
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar comentarios",
      error: error.message,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { text, parentCommentId } = req.body;
    const { postId } = req.params;
    const userId = req.user.id;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "El comentario no puede estar vacío",
      });
    }

    let parentId = null;

    if (parentCommentId) {
      parentId = Number(parentCommentId);

      if (Number.isNaN(parentId)) {
        return res.status(400).json({
          message: "El comentario padre no es válido",
        });
      }

      const parentComment = await models.Comment.findOne({
        where: {
          id: parentId,
          postId,
        },
      });

      if (!parentComment) {
        return res.status(404).json({
          message: "El comentario que querés responder no existe",
        });
      }
    }

    const comment = await models.Comment.create({
      text: text.trim(),
      userId,
      postId,
      parentCommentId: parentId,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear comentario",
      error: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await models.Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "No se pudo encontrar el comentario",
      });
    }

    if (Number(comment.userId) !== Number(req.user.id)) {
      return res.status(403).json({
        message: "Solo el autor puede editar este comentario",
      });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "El comentario no puede estar vacío",
      });
    }

    await comment.update({
      text: text.trim(),
    });

    res.json({
      message: "Comentario actualizado correctamente",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar comentario",
      error: error.message,
    });
  }
};


const getNestedCommentIds = async (commentId) => {
  const children = await models.Comment.findAll({
    where: {
      parentCommentId: commentId,
    },
  });

  const ids = [];

  for (const child of children) {
    const nestedIds = await getNestedCommentIds(child.id);
    ids.push(...nestedIds, child.id);
  }

  return ids;
};

export const deleteComment = async (req, res) => {
  try {
    const loggedUser = req.user;

    if (!loggedUser || !["ADMIN", "SYSADMIN"].includes(loggedUser.rol)) {
      return res.status(403).json({
        message: "Solo un ADMIN o SYSADMIN puede borrar comentarios",
      });
    }

    const comment = await models.Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "No se pudo encontrar el comentario",
      });
    }

    const nestedCommentIds = await getNestedCommentIds(comment.id);
    const idsToDelete = [...nestedCommentIds, comment.id];

    const commentsToDelete = await models.Comment.findAll({
  where: {
    id: {
      [Op.in]: idsToDelete,
      },
    },
    include: [models.Person],
  });

  const hasSysAdminComment = commentsToDelete.some(
    (comment) => comment.Person?.rol === "SYSADMIN"
  );

  if (loggedUser.rol === "ADMIN" && hasSysAdminComment) {
    return res.status(403).json({
      message:
        "No tienes permisos",
    });
  }

    for (const commentId of idsToDelete) {
      await models.Comment.destroy({
        where: {
          id: commentId,
        },
      });
    }

    res.json({
      message: "Comentario eliminado correctamente",
      deletedComments: idsToDelete.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar comentario",
      error: error.message,
    });
  }
};

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