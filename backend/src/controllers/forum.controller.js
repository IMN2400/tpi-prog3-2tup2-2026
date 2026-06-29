import { Forum, Person, Post, Comment } from "../models/models.js";

export const getForums = async (req, res) => {
  try {
    const forums = await Forum.findAll({
      include: [
        {
          model: Person,
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Post,
          attributes: ["id", "status"],
          required: false,
          where: { status: true },
        },
      ],
    });

    res.json(forums);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los foros",
      error: error.message,
    });
  }
};

export const getForumById = async (req, res) => {
  try {
    const { id } = req.params;

    const forum = await Forum.findByPk(id, {
      include: {
        model: Person,
        attributes: ["id", "name", "email", "role"],
      },
});

    if (!forum) {
      return res.status(404).json({
        message: "Foro no encontrado",
      });
    }

    res.json(forum);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el foro",
      error: error.message,
    });
  }
};

export const createForum = async (req, res) => {
  try {
    const { name, desc, rules } = req.body;

    const newForum = await Forum.create({
      name,
      desc,
      rules,
      founderId: req.user.id,
    });

    res.status(201).json(newForum);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el foro",
      error: error.message,
    });
  }
};

export const updateForum = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, rules, status } = req.body;

    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res.status(404).json({
        message: "Foro no encontrado",
      });
    }

    const dataToUpdate = {};

    if (name !== undefined) dataToUpdate.name = name;
    if (desc !== undefined) dataToUpdate.desc = desc;
    if (rules !== undefined) dataToUpdate.rules = rules;
    if (status !== undefined) dataToUpdate.status = status;

    await forum.update(dataToUpdate);

    res.json({
      message: "Foro actualizado correctamente",
      forum,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el foro",
      error: error.message,
    });
  }
};

export const deleteForum = async (req, res) => {
  try {
    const { id } = req.params;

    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res.status(404).json({
        message: "Foro no encontrado",
      });
    }

    await forum.update({
      status: false,
    });

    res.json({
      message: "Foro dado de baja correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al dar de baja el foro",
      error: error.message,
    });
  }
};