import BanModel from '../models/Bans.js';
import { Person } from '../models/Person.js';

export const createBan = async (req, res) => {
    try {
        const { userId, adminId, reason, duration } = req.body;

        if (!userId || !adminId || !reason || !duration) {
            return res.status(400).json({
                message: 'Faltan datos obligatorios'
            });
        }

        const user = await Person.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'El usuario no existe'
            });
        }

        const newBan = await BanModel.create({
            userId,
            adminId,
            reason,
            duration,
            date: new Date()
        });

        res.status(201).json(newBan);

    } catch (error) {
        res.status(500).json({
            message: 'Error al crear el ban',
            error: error.message
        });
    }
};


export const getBans = async (req, res) => {
    try {
        const bans = await BanModel.findAll();

        res.json(bans);

    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener bans',
            error: error.message
        });
    }
};


export const getBanByUser = async (req, res) => {
    try {

        const { id } = req.params;

        const bans = await BanModel.findAll({
            where: {
                userId: id
            }
        });

        res.json(bans);

    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los bans del usuario',
            error: error.message
        });
    }
};

export const updateBan = async (req, res) => {

    try {

        const { id } = req.params;

        const ban = await BanModel.findByPk(id);

        if (!ban) {
            return res.status(404).json({
                message: 'Ban no encontrado'
            });
        }

        await ban.update(req.body);

        res.status(200).json({
            message: 'Ban actualizado',
            ban
        });

    } catch (error) {

        res.status(500).json({
            message:
                'Error al actualizar el ban',
            error: error.message
        });
    }
};