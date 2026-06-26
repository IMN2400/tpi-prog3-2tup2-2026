import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const BanModel = sequelize.define('Ban', {

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
    type: DataTypes.ENUM(
        'activo',
        'expirado',
        'desbaneado'
    ),
    allowNull: false,
    defaultValue: 'activo'
    }
});

export default BanModel;