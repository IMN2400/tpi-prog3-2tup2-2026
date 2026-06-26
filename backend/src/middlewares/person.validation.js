export const validateCreatePerson = (req, res, next) => {

    const { name, age, email, password } = req.body;

    const errors = [];

    if (!name) errors.push("El nombre es obligatorio");

    if (age === undefined || age === null) {
        errors.push("La edad es obligatoria");
    } else if (age < 0) {
        errors.push("La edad no puede ser negativa");
     }

    if (!email) errors.push("El correo es obligatorio");

    if (!password) errors.push("La contraseña es obligatoria");

    

    if (errors.length > 0) {
        return res.status(400).json(errors);
    }

  next();
};

export const validateUpdatePerson = (req, res, next) => {
  const { name, age, email, password } = req.body;

  const errors = [];

  if (name !== undefined && name === "") {
    errors.push("El nombre no puede estar vacío");
  }

  if (age !== undefined) {
    if (age === null) {
      errors.push("La edad no puede ser null");
    } else if (age < 0) {
      errors.push("La edad no puede ser negativa");
    }
  }

  if (email !== undefined && email === "") {
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