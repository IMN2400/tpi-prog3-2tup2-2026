import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Person = sequelize.define("Person", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("USER", "ADMIN", "SYSADMIN"),
    defaultValue: "USER",
  },

  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  numeroBaneos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  fechaDesbaneo: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});