export const validateCreatePerson = (req, res, next) => {

    const { nombre, edad, correo, password } = req.body;

    const errors = [];

    if (!nombre) errors.push("El nombre es obligatorio");

    if (edad === undefined || edad === null) {
        errors.push("La edad es obligatoria");
    } else if (edad < 0) {
        errors.push("La edad no puede ser negativa");
     }

    if (!correo) errors.push("El correo es obligatorio");

    if (!password) errors.push("La contraseña es obligatoria");

    

    if (errors.length > 0) {
        return res.status(400).json(errors);
    }

  next();
};

export const validateUpdatePerson = (req, res, next) => {
  const { nombre, edad, correo, password } = req.body;

  const errors = [];

  if (nombre !== undefined && nombre === "") {
    errors.push("El nombre no puede estar vacío");
  }

  if (edad !== undefined) {
    if (edad === null) {
      errors.push("La edad no puede ser null");
    } else if (edad < 0) {
      errors.push("La edad no puede ser negativa");
    }
  }

  if (correo !== undefined && correo === "") {
    errors.push("El correo no puede estar vacío");
  }

  if (password !== undefined && password === "") {
    errors.push("La contraseña no puede estar vacía");
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  next();
};