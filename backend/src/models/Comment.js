import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

export const Comment = sequelize.define (
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
        },
         postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        
        parentCommentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    });

