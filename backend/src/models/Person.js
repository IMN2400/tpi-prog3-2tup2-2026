import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Person = sequelize.define("Person", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  age: {
    type: DataTypes.INTEGER,
  },

  dob: {
    type: DataTypes.DATEONLY,
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

  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  timesBanned: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  dateBanLifted: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});