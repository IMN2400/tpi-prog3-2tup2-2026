import Ban from '../models/Ban.js';

// Crear un ban
export const createBan = async (req, res) => {
    try {
        const { userId, adminId, reason, duration } = req.body;

        if (!userId || !adminId || !reason || !duration) {
            return res.status(400).json({
                message: 'Faltan datos obligatorios'
            });
        }

        const newBan = await Ban.create({
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
        const bans = await Ban.findAll();

        res.json(bans);

    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener bans',
            error: error.message
        });
    }
};