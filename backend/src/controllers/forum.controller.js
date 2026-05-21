import { Forum, Person } from "../models/index.js";

export const getForums = async (req, res) => {
  try {
    const forums = await Forum.findAll({
      include: {
        model: Person,
        attributes: ["id", "nombre", "correo", "rol"],
      },
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
        attributes: ["id", "nombre", "correo", "rol"],
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
    const { nombre, descripcion, reglas } = req.body;

    const newForum = await Forum.create({
      nombre,
      descripcion,
      reglas,
      fundadorId: req.user.id,
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
    const { nombre, descripcion, reglas, estado } = req.body;

    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res.status(404).json({
        message: "Foro no encontrado",
      });
    }

    const dataToUpdate = {};

    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (descripcion !== undefined) dataToUpdate.descripcion = descripcion;
    if (reglas !== undefined) dataToUpdate.reglas = reglas;
    if (estado !== undefined) dataToUpdate.estado = estado;

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
      estado: false,
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