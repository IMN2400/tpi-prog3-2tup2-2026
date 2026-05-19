import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Forum = sequelize.define("Forum", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

   descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  reglas: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ""
  },

   estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  fundadorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
