import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Person } from "../models/index.js";

const JWT_SECRET = "clave_temporal";

export const registerUser = async (req, res) => {
  try {
    const { nombre, edad, correo, password } = req.body;

    if (!nombre || !edad || !correo || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    const existingUser = await Person.findOne({
      where: { correo },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "El usuario ya existe",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Person.create({
      nombre,
      edad,
      correo,
      password: hashedPassword,
      rol: "USER",
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        edad: newUser.edad,
        correo: newUser.correo,
        rol: newUser.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        message: "Correo y contraseña son obligatorios",
      });
    }

    const user = await Person.findOne({
      where: { correo },
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

    const token = jwt.sign(
      {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
      JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};