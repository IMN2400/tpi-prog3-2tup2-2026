import { Person } from "../models/index.js";

export const onlyAdminOrSysadmin = async (req, res, next) => {
  try {
    const personId = req.headers.personid;

    if (!personId) {
      return res.status(401).json({
        message: "Falta identificar al usuario",
      });
    }

    const person = await Person.findByPk(personId);

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