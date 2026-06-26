import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Person } from "../models/index.js";

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

    if (user.status === false) {
      const hoy = new Date();
      const dateBanLifted = new Date(user.dateBanLifted);

      if (dateBanLifted > hoy) {
        const diferencia = dateBanLifted - hoy;
        const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

        return res.status(403).json({
          message: `Ha sido baneado, el ban se levantará en ${diasRestantes} día${
            diasRestantes === 1 ? "" : "s"
          }.`,
          diasRestantes,
        });
      }

      await user.update({
        status: true,
        dateBanLifted: null,
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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