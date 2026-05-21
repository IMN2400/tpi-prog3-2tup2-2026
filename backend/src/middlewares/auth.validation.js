export const validateRegister = (req, res, next) => {
  const { nombre, edad, correo, password } = req.body;

  const errors = [];

  if (!nombre || nombre.trim() === "") {
    errors.push("El nombre es obligatorio");
  }

  if (edad === undefined || edad === null) {
    errors.push("La edad es obligatoria");
  }

  if (!correo || correo.trim() === "") {
    errors.push("El correo es obligatorio");
  } else if (!correo.includes("@")) {
    errors.push("El correo no tiene un formato válido");
  }

  if (!password) {
    errors.push("La contraseña es obligatoria");
  } else if (password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      errors,
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { correo, password } = req.body;

  const errors = [];

  if (!correo || correo.trim() === "") {
    errors.push("El correo es obligatorio");
  } else if (!correo.includes("@")) {
    errors.push("El correo no tiene un formato válido");
  }

  if (!password) {
    errors.push("La contraseña es obligatoria");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      errors,
    });
  }

  next();
};