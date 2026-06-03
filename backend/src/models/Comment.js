import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

export const CommentModel = sequelize.define (
    "Comment",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
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
    }
)
