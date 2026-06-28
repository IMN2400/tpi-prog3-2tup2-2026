import { Person, Forum } from "../models/index.js";
import models from "../models/index.js";
import { Op } from "sequelize";

export const onlyAdminOrSysadmin = async (req, res, next) => {
  try {
    const personId = req.user.id;

    if (!personId) {
      return res.status(401).json({
        message: "Falta identificar al usuario",
      });
    }

    const person = await Person.findOne({
        where: {
          id: personId,
          status: true,
        },
      });

    if (!person) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (person.role !== "ADMIN" && person.role !== "SYSADMIN") {
      return res.status(403).json({
        message: "No tenés permisos para realizar esta acción",
      });
    }

    req.user = person;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error al verificar permisos",
      error: error.message,
    });
  }
};

export const onlySysadmin = async (req, res, next) => {
  try {
    const personId = req.user.id;

    if (!personId) {
      return res.status(401).json({
        message: "Falta identificar al usuario",
      });
    }

    const person = await Person.findOne({
      where: {
        id: personId,
        status: true,
      },
    });

    if (!person) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (person.role !== "SYSADMIN") {
      return res.status(403).json({
        message: "No tenés permisos para realizar esta acción",
      });
    }

    req.user = person;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error al verificar permisos",
      error: error.message,
    });
  }
};

const getNestedCommentIds = async (commentId) => {
  const children = await models.Comment.findAll({
    where: {
      parentCommentId: commentId,
      status: true,
    },
  });

  const ids = [];

  for (const child of children) {
    const nestedIds = await getNestedCommentIds(child.id);
    ids.push(...nestedIds, child.id);
  }

  return ids;
};

export const canDeleteComment = async (req, res, next) => {
  try {
    const loggedUserId = req.user.id;

    const person = await models.Person.findOne({
      where: {
        id: loggedUserId,
        status: true,
      },
    });

    if (!person) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const comment = await models.Comment.findOne({
      where: {
        id: req.params.id,
        status: true,
      },
      include: [models.Person],
    });

    if (!comment) {
      return res.status(404).json({
        message: "No se pudo encontrar el comentario",
      });
    }

    const isOwner = Number(comment.userId) === Number(person.id);
    const isAdmin = person.role === "ADMIN";
    const isSysAdmin = person.role === "SYSADMIN";

    let idsToDelete = [comment.id];

    const nestedCommentIds = await getNestedCommentIds(comment.id);
    idsToDelete = [...nestedCommentIds, comment.id];

    // Sysadmin puede borrar cualquier comentario
    if (isSysAdmin) {
      req.user = person;
      req.comment = comment;
      req.commentIdsToDelete = idsToDelete;
      return next();
    }

    // el autor puede borrar su propio comentario
    if (isOwner) {
      req.user = person;
      req.comment = comment;
      req.commentIdsToDelete = idsToDelete;
      return next();
    }

    // si no es dueño, admin ni sysadmin, no puede borrar
    if (!isAdmin) {
      return res.status(403).json({
        message: "No tenés permisos para borrar este comentario",
      });
    }

    // Admin no puede borrar comentarios de sysadmin
    if (comment.Person?.role === "SYSADMIN") {
      return res.status(403).json({
        message: "No tenés permisos para borrar comentarios de un SYSADMIN",
      });
    }

    // Admin puede borrar un hilo que tenga comments de sysadmin
    const commentsToDelete = await models.Comment.findAll({
      where: {
        id: {
          [Op.in]: idsToDelete,
        },
      },
      include: [models.Person],
    });

    const hasSysAdminComment = commentsToDelete.some(
      (comment) => comment.Person?.role === "SYSADMIN"
    );

    if (hasSysAdminComment) {
      return res.status(403).json({
        message: "No tenés permisos para borrar comentarios de un SYSADMIN",
      });
    }

    req.user = person;
    req.comment = comment;
    req.commentIdsToDelete = idsToDelete;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error al verificar permisos del comentario",
      error: error.message,
    });
  }
};

export const canEditForum = async (req, res, next) => {
  try {
    const forumId = req.params.id
    const person = req.user

    const forum = await Forum.findOne({
        where: {
          id: forumId,
          status: true,
        },
      });

    if (!forum) {
      return res.status(404).json({
        message: "Foro no encontrado",
      });
    }


    if ((person.role !== "ADMIN" || person.id !== forum.founderId) && person.role !== "SYSADMIN") {
      return res.status(403).json({
        message: "No tenés permisos para realizar esta acción",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error al verificar permisos",
      error: error.message,
    });
  }
};

export const canEditPost = async (req, res, next) => {
  try {
    const loggedUserId = req.user.id;

    const person = await models.Person.findOne({
      where: {
        id: loggedUserId,
        status: true,
      },
    });

    if (!person) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const post = await models.Post.findOne({
      where: {
        id: req.params.id,
        status: true,
      },
      include: [models.Person],
    });

    if (!post) {
      return res.status(404).json({
        message: "No se encontró el post",
      });
    }

    const isOwner = Number(post.userId) === Number(person.id);

    if (!isOwner) {
      return res.status(403).json({
        message: "No tenés permisos para editar este post",
      });
    }

    req.user = person;
    req.post = post;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error al verificar permisos para editar el post",
      error: error.message,
    });
  }
};

export const canDeletePost = async (req, res, next) => {
  try {
    const loggedUserId = req.user.id;

    const person = await models.Person.findOne({
      where: {
        id: loggedUserId,
        status: true,
      },
    });

    if (!person) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const post = await models.Post.findOne({
      where: {
        id: req.params.id,
        status: true,
      },
      include: [models.Person],
    });

    if (!post) {
      return res.status(404).json({
        message: "No se encontró el post",
      });
    }

    const isSysAdmin = person.role === "SYSADMIN";
    const isAdmin = person.role === "ADMIN";
    const postAuthorIsSysAdmin = post.Person?.role === "SYSADMIN";

    if (isSysAdmin) {
      req.user = person;
      req.post = post;
      return next();
    }

    if (isAdmin && !postAuthorIsSysAdmin) {
      req.user = person;
      req.post = post;
      return next();
    }

    return res.status(403).json({
      message: "No tenés permisos para eliminar este post",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al verificar permisos para eliminar el post",
      error: error.message,
    });
  }
};