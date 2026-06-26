import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Forum = sequelize.define("Forum", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

   desc: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  rules: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ""
  },

   status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  founderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
