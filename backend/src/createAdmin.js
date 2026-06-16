import bcrypt from "bcrypt";
import { sequelize } from "./config/database.js";
import { Person } from "./models/index.js";

const createAdmin = async () => {
  try {
    await sequelize.authenticate();

    const existingAdmin = await Person.findOne({
      where: { correo: "admin@gmail.com" },
    });

    if (existingAdmin) {
      console.log("El admin ya existe");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await Person.create({
      nombre: "Admin",
      correo: "admin@gmail.com",
      password: hashedPassword,
      edad: 30,
      rol: "ADMIN",
      estado: true,
    });

    console.log("Admin creado correctamente");
    process.exit();
  } catch (error) {
    console.error("Error creando admin:", error);
    process.exit(1);
  }
};

createAdmin();