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

        const dateBanLifted = new Date();
        dateBanLifted.setDate(dateBanLifted.getDate() + duration);

        await user.update({
            timesBanned: (user.timesBanned || 0) + 1,
            dateBanLifted,
            status: false,
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

        const today = new Date();

        for (const ban of bans) {
            const banDate = new Date(ban.date);
            const expirationDate = new Date(banDate);

            expirationDate.setDate(expirationDate.getDate() + ban.duration);

            if (expirationDate < today && ban.status === "activo") {
                await ban.update({ status: "expirado" });
            }
        }

        const updatedBans = await BanModel.findAll({
            include: [
                {
                    model: Person,
                    as: "bannedUser",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Person,
                    as: "adminUser",
                    attributes: ["id", "name", "email"],
                },
            ],
            order: [["date", "DESC"]],
        });

        res.json(updatedBans);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener bans",
            error: error.message,
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

        const today =
            new Date();

        for (const ban of bans) {

            const banDate =
                new Date(ban.date);

            const expirationDate =
                new Date(banDate);

            expirationDate.setDate(
                expirationDate.getDate()
                + ban.duration
            );

            if (
                expirationDate < today &&
                ban.status === 'activo'
            ) {

                await ban.update({
                    status: 'expirado'
                });
            }
        }

        const updatedBans =
            await BanModel.findAll({
                where: {
                    userId: id
                }
            });

        res.json(updatedBans);


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
        const oldDuration = ban.duration;
        const oldStatus = ban.status;

        const banDate = new Date(ban.date);
        const today = new Date();
        const daysElapsed = Math.floor(
            (today - banDate) / (1000 * 60 * 60 * 24)
        );

        await ban.update(req.body);

        if (oldDuration !== ban.duration || oldStatus !== ban.status) {
            const user = await Person.findByPk(ban.userId);
            if (!user) {
                return res.status(404).json({
                    message: 'El usuario no existe'
                });
            }

            if (oldStatus !== "desbaneado" && ban.status === "desbaneado") {
                const dateBanLifted = new Date();

                await user.update({
                    timesBanned: Math.max(user.timesBanned - 1, 0),
                    dateBanLifted,
                    status: true
                });
            } else {
                const banDate = new Date(ban.date);

                const dateBanLifted = new Date(banDate);

                dateBanLifted.setDate(dateBanLifted.getDate() + ban.duration);

                const today = new Date();

                if (today < dateBanLifted) {
                    await user.update({
                        dateBanLifted,
                    });
                } else {
                    await user.update({
                        dateBanLifted,
                        status: true
                    })
                }
            }
        }
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