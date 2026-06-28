import { Person } from "../models/Person.js";

export const getPersons = async (req, res) => {
  try {
    const persons = await Person.findAll({
      attributes: { exclude: ["password"] },
    });

    res.json(persons);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los usuarios",
      error: error.message,
    });
  }
};

export const getPersonById = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await Person.findByPk(id, {
      where: {
        id,
        status: true,
      },
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
      message: "Error al obtener el usuario",
      error: error.message,
    });
  }
};

export const createPerson = async (req, res) => {
  try {
    const { name, age, email, password, role } = req.body;

    const newPerson = await Person.create({
      name,
      age,
      email,
      password,
      role,
    });

    const personResponse = newPerson.toJSON();
    delete personResponse.password;

    res.status(201).json(personResponse);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message,
    });
  }
};

export const updatePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, email, password, role, status } = req.body;

    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    
    const dataToUpdate = {};

    if (name !== undefined) dataToUpdate.name = name;
    if (age !== undefined) dataToUpdate.age = age;
    if (email !== undefined) dataToUpdate.email = email;
    if (password !== undefined) dataToUpdate.password = password;
    if (status !== undefined) dataToUpdate.status = status;
    if (role !== undefined) dataToUpdate.role = role;

    await person.update(dataToUpdate);

    const personResponse = person.toJSON();
    delete personResponse.password;


    res.json({
      message: "Usuario actualizado correctamente",
      person: personResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (person.role === "SYSADMIN") {
      return res.status(400).json({
        message: "No se puede modificar el rol de un SYSADMIN",
      });
    }
    
    if (person.status === false) {
      return res.status(400).json({
        message: "No se puede convertir en ADMIN a un usuario baneado",
      });
    }

    if (person.role === "ADMIN") {
      return res.json({
        message: "El usuario ya es ADMIN",
      });
    }

    await person.update({
      role: "ADMIN",
    });

    const personResponse = person.toJSON();
    delete personResponse.password;

    res.json({
      message: "Usuario convertido en ADMIN correctamente",
      person: personResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al convertir usuario en ADMIN",
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
        message: "Usuario no encontrado",
      });
    }

    await person.destroy();

    res.json({
      message: "Usuario dado de baja correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al dar de baja el usuario",
      error: error.message,
    });
  }
};