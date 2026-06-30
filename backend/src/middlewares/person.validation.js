export const validateCreatePerson = (req, res, next) => {
  const { name, age, email, password } = req.body;

  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("El nombre es obligatorio");
  }

  if (age === undefined || age === null) {
    errors.push("La edad es obligatoria");
  } else if (Number.isNaN(Number(age))) {
    errors.push("La edad debe ser un número");
  } else if (Number(age) <= 13) {
    errors.push("La edad debe ser mayor a 13");
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
  const { name, age, email, password, currentPassword } = req.body;

  const errors = [];

  if (name !== undefined && name.trim() === "") {
    errors.push("El nombre no puede estar vacío");
  }

  if (age !== undefined) {
    if (age === null) {
      errors.push("La edad no puede ser null");
    } else if (Number.isNaN(Number(age))) {
      errors.push("La edad debe ser un número");
    } else if (Number(age) <= 13) {
      errors.push("La edad debe ser mayor a 13");
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