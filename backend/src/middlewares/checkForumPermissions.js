import { Person } from "../models/index.js";
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
          estado: true,
        },
      });

    if (!person) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (person.rol !== "ADMIN" && person.rol !== "SYSADMIN") {
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
        estado: true,
      },
    });

    if (!person) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (person.rol !== "SYSADMIN") {
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
        estado: true,
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
    const isAdmin = person.rol === "ADMIN";
    const isSysAdmin = person.rol === "SYSADMIN";

    if (!isOwner && !isAdmin && !isSysAdmin) {
      return res.status(403).json({
        message: "No tenés permisos para borrar este comentario",
      });
    }

    if (isAdmin && comment.Person?.rol === "SYSADMIN" && !isOwner) {
      return res.status(403).json({
        message: "No tenés permisos para borrar comentarios de un SYSADMIN",
      });
    }

    let idsToDelete = [comment.id];

    if ((isAdmin || isSysAdmin) && !isOwner) {
      const nestedCommentIds = await getNestedCommentIds(comment.id);
      idsToDelete = [...nestedCommentIds, comment.id];

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

      if (isAdmin && hasSysAdminComment) {
        return res.status(403).json({
          message: "No tenés permisos para borrar comentarios de un SYSADMIN",
        });
      }
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