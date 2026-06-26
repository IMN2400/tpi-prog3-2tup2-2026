export const validateRegister = (req, res, next) => {
  const { name, age, email, password } = req.body;

  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("El nombre es obligatorio");
  }

  if (age === undefined || age === null) {
    errors.push("La edad es obligatoria");
  }

  if (!email || email.trim() === "") {
    errors.push("El correo es obligatorio");
  } else if (!email.includes("@")) {
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
  const { email, password } = req.body;

  const errors = [];

  if (!email || email.trim() === "") {
    errors.push("El correo es obligatorio");
  } else if (!email.includes("@")) {
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