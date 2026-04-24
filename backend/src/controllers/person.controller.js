import { Person } from "../models/Person.js";

export const getPersons = async (req, res) => {
  try {
    const persons = await Person.findAll();

    res.json(persons);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las personas",
      error: error.message,
    });
  }
};

export const getPersonById = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({
        message: "Persona no encontrada",
      });
    }

    res.json(person);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la persona",
      error: error.message,
    });
  }
};

export const createPerson = async (req, res) => {
  try {
    const { nombre, edad, correo, password, rol } = req.body;

    const newPerson = await Person.create({
      nombre,
      edad,
      correo,
      password,
      rol,
    });

    res.status(201).json(newPerson);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la persona",
      error: error.message,
    });
  }
};

export const updatePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, edad, correo, password, rol, estado } = req.body;

    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({
        message: "Persona no encontrada",
      });
    }

    await person.update({
      nombre,
      edad,
      correo,
      password,
      rol,
      estado,
    });

    res.json({
      message: "Persona actualizada correctamente",
      person,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la persona",
      error: error.message,
    });
  }
};

export const deletePerson = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({
        message: "Persona no encontrada",
      });
    }

    await person.update({
      estado: false,
    });

    res.json({
      message: "Persona dada de baja correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al dar de baja la persona",
      error: error.message,
    });
  }
};