import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

export const PostModel = sequelize.define (
    "Post",
    {
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
            references: {
                model: "User",
                key: "id",
            },
        },
        likeCount: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        },
        postDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        }
    }
)
