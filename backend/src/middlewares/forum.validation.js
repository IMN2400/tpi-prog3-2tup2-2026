export const validateCreateForum = (req, res, next) => {
  const { name, desc} = req.body;

  const errors = [];

  if (!name) errors.push("El nombre es obligatorio");
  if (!desc) errors.push("La descripción es obligatoria");

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  next();
};

export const validateUpdateForum = (req, res, next) => {
  const { name, desc, rules } = req.body;

  const errors = [];

  if (name !== undefined && name.trim() === "") {
    errors.push("Nombre requerido");
  }

  if (desc !== undefined && desc.trim() === "") {
    errors.push("Descripción requerida");
  }

  // las reglas no es obligatorio pero si vienen no pueden quedar vacias.
  if (rules !== undefined && rules.trim() === "") {
    errors.push("Reglas no pueden estar vacías");
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  next();
};