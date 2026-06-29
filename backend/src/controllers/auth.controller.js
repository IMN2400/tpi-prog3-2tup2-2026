import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Person } from "../models/models.js";
import BanModel from "../models/Bans.js";

const JWT_SECRET = "clave_temporal";

export const registerUser = async (req, res) => {
  try {
    const { name, age, email, password } = req.body;

    if (!name || !age || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    const existingUser = await Person.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "El correo ya se encuentra registrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Person.create({
      name,
      age,
      email,
      password: hashedPassword,
      role: "USER",
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        age: newUser.age,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

const validateBanBeforeLogin = async (user) => {
  const activeBans = await BanModel.findAll({
    where: {
      userId: user.id,
      status: "activo",
    },
  });

  await Promise.all(
    activeBans.map(async (ban) => {
      const today = new Date();

      const banDate = new Date(ban.date);
      const expirationDate = new Date(banDate);

      expirationDate.setDate(expirationDate.getDate() + ban.duration);

      if (expirationDate < today) {
        await ban.update({
          status: "expirado",
        });
      }
    })
  );

  const activeBan = await BanModel.findOne({
    where: {
      userId: user.id,
      status: "activo",
    },
  });

  if (!activeBan) {
    if (user.status === false) {
      await user.update({
        status: true,
        dateBanLifted: null,
      });
    }

    return {
      isBanned: false,
    };
  }

  const today = new Date();

  const banDate = new Date(activeBan.date);
  const expirationDate = new Date(banDate);

  expirationDate.setDate(expirationDate.getDate() + activeBan.duration);

  const diferencia = expirationDate - today;
  const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

  await user.update({
    status: false,
    dateBanLifted: expirationDate,
  });

  return {
    isBanned: true,
    diasRestantes,
  };
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Correo y contraseña son obligatorios",
      });
    }

    const user = await Person.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    const banValidation = await validateBanBeforeLogin(user);

    if (banValidation.isBanned) {
      return res.status(403).json({
        message: `Ha sido baneado, el ban se levantará en ${banValidation.diasRestantes} día${
          banValidation.diasRestantes === 1 ? "" : "s"
        }.`,
        diasRestantes: banValidation.diasRestantes,
      });
    }

    await user.reload();

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: 7200,
      }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};