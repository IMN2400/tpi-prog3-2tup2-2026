import dayjs from "dayjs";
import { calculateAge } from "./age.services.js";

export const validateCreatePerson = (req, res, next) => {
  const { name, dob, email, password } = req.body;
  const age = calculateAge(dob)
  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("El nombre es obligatorio");
  }

  if (age === undefined || age === null) {
    errors.push("La edad es obligatoria");
  } else if (Number.isNaN(Number(age))) {
    errors.push("La edad debe ser un número");
  } else if (Number(age) <= 17) {
    errors.push("La edad debe ser mayor a 18");
  }

  if (!email || email.trim() === "") {
    errors.push("El correo es obligatorio");
  }

  if (!password || password.trim() === "") {
    errors.push("La contraseña es obligatoria");
  } else if (password.trim().length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors[0],
      errors
    });
  }

  next();
};

export const validateUpdatePerson = (req, res, next) => {
  const { name, dob, email, password, currentPassword } = req.body;
  const age = calculateAge(dob)
  const errors = [];

  if (name !== undefined && name.trim() === "") {
    errors.push("El nombre no puede estar vacío");
  }

  if (dob !== undefined) {
    if (dob === null) {
      errors.push("La fecha de nacimiento no puede quedar vacía.");
    } else if (!dayjs(dob).isValid()) {
      errors.push("La fecha de nacimiento debe ser una fecha.");
    } else if (Number(age) <= 17) {
      errors.push("La edad debe ser mayor a 18");
    }
  }

  if (email !== undefined && email.trim() === "") {
    errors.push("El correo no puede estar vacío");
  }

  if (currentPassword !== undefined && currentPassword.trim() !== "" && (!password || password.trim() === "")) {
    errors.push("Ingresá una nueva contraseña");
  }

  if (password !== undefined && password.trim() !== "") {
    if (!currentPassword || currentPassword.trim() === "") {
      errors.push("Debés ingresar tu contraseña actual para cambiarla");
    }

    if (password.trim().length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres");
    }
  }

  if (password !== undefined && password.trim() === "") {
    errors.push("La contraseña no puede estar vacía");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors[0],
      errors
    });
  }

  next();
};