import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

export const Post = sequelize.define ("Post", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        likeCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        postDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        forumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
    })
