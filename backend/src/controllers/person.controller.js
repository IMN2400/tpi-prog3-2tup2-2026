import { Person } from "../models/Person.js";

export const getPersons = async (req, res) => {
  try {
    const persons = await Person.findAll({
      attributes: { exclude: ["password"] },
    });

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

    const person = await Person.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

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

    const personResponse = newPerson.toJSON();
    delete personResponse.password;

    res.status(201).json(personResponse);
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
    
    const dataToUpdate = {};

    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (edad !== undefined) dataToUpdate.edad = edad;
    if (correo !== undefined) dataToUpdate.correo = correo;
    if (password !== undefined) dataToUpdate.password = password;
    if (estado !== undefined) dataToUpdate.estado = estado;
    if (rol !== undefined) dataToUpdate.rol = rol;

    await person.update(dataToUpdate);

    const personResponse = person.toJSON();
    delete personResponse.password;


    res.json({
      message: "Persona actualizada correctamente",
      person: personResponse,
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