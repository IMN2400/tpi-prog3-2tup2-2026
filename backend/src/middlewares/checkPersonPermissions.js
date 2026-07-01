import { Person } from "../models/models.js";

export const canManagePersons = async (req, res, next) => {
  try {
    const loggedUser = req.user;
    const targetUserId = Number(req.params.id);

    if (!loggedUser) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    // SYSADMIN puede hacer todo
    if (loggedUser.role === "SYSADMIN") {
      return next();
    }

    // ADMIN puede administrar usuarios, pero no SYSADMIN
    if (loggedUser.role === "ADMIN") {
      const targetUser = await Person.findByPk(targetUserId);

      if (!targetUser) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      if (targetUser.role === "SYSADMIN") {
        return res.status(403).json({
          message: "No puedes modificar un Administrador",
        });
      }

      return next();
    }

    // USER solo puede modificarse a sí mismo
    if (loggedUser.role === "USER") {
      if (loggedUser.id !== targetUserId) {
        return res.status(403).json({
          message: "No tienes permisos para realizar la accion",
        });
      }

      // USER no puede cambiar su rol
      if (req.body?.role !== undefined) {
        return res.status(403).json({
          message: "No podés modificar tu rol",
        });
      }

      return next();
    }

    return res.status(403).json({
      message: "No tenés permisos",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error al verificar permisos de usuario",
      error: error.message,
    });
  }
};

export const onlySysAdmin = (req, res, next) => {
  const loggedUser = req.user;

  if (!loggedUser) {
    return res.status(401).json({
      message: "Usuario no autenticado",
    });
  }

  if (loggedUser.role !== "SYSADMIN") {
    return res.status(403).json({
      message: "Solo un SYSADMIN puede realizar esta acción",
    });
  }

  next();
};


export const onlyAdminOrSysadmin = async (req, res, next) => {
  try {
    const loggedUserId = req.user?.id;

    if (!loggedUserId) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const loggedUser = await Person.findOne({
      where: {
        id: loggedUserId,
        status: true,
      },
    });

    if (!loggedUser) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (loggedUser.role !== "ADMIN" && loggedUser.role !== "SYSADMIN") {
      return res.status(403).json({
        message: "Solo administradores pueden acceder a esta información",
      });
    }

    req.user = loggedUser;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error al verificar permisos de usuario",
      error: error.message,
    });
  }
};