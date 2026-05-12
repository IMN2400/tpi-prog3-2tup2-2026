export const validateCreateForum = (req, res, next) => {
  const { nombre, descripcion} = req.body;

  const errors = [];

  if (!nombre) errors.push("El nombre es obligatorio");
  if (!descripcion) errors.push("La descripción es obligatoria");

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  next();
};

export const validateUpdateForum = (req, res, next) => {
  const { nombre, descripcion, reglas } = req.body;

  const errors = [];

  if (nombre !== undefined && nombre.trim() === "") {
    errors.push("Nombre requerido");
  }

  if (descripcion !== undefined && descripcion.trim() === "") {
    errors.push("Descripción requerida");
  }

  // las reglas no es obligatorio pero si vienen no pueden quedar vacias.
  if (reglas !== undefined && reglas.trim() === "") {
    errors.push("Reglas no pueden estar vacías");
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  next();
};