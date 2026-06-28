import BanModel from '../models/Bans.js';
import { Person } from '../models/Person.js';

const expireBanAndReactivateUser = async (ban) => {
  const today = new Date();

  const banDate = new Date(ban.date);
  const expirationDate = new Date(banDate);

  expirationDate.setDate(expirationDate.getDate() + ban.duration);

  if (expirationDate < today && ban.status === "activo") {
    await ban.update({
      status: "expirado",
    });
  }

  const updatedBan = await BanModel.findByPk(ban.id);

  if (!updatedBan) {
    return;
   }

  if (updatedBan.status === "expirado") {
    const activeBan = await BanModel.findOne({
      where: {
        userId: updatedBan.userId,
        status: "activo",
      },
    });

    if (!activeBan) {
      const bannedUser = await Person.findByPk(updatedBan.userId);

      if (bannedUser && bannedUser.status === false) {
        await bannedUser.update({
          status: true,
          dateBanLifted: null,
        });
      }
    }
  }
};

export const createBan = async (req, res) => {
    try {
        const { userId, adminId, reason, duration } = req.body;

        if (!userId || !adminId || !reason || !duration) {
            return res.status(400).json({
                message: 'Faltan datos obligatorios'
            });
        }

        const durationNumber = Number(duration);

        if (Number.isNaN(durationNumber) || durationNumber <= 0) {
            return res.status(400).json({
                message: "La duración del ban debe ser mayor a 0",
            });
            }

        const user = await Person.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'El usuario no existe'
            });
        }

        const userBans = await BanModel.findAll({
            where: {
                userId,
            },
            });

            await Promise.all(
            userBans.map((ban) => expireBanAndReactivateUser(ban))
            );

        const activeBan = await BanModel.findOne({
            where: {
                userId,
                status: "activo",
            },
            });

            if (activeBan) {
            return res.status(400).json({
                message: "Este usuario ya se encuentra baneado",
            });
            }

        const newBan = await BanModel.create({
            userId,
            adminId,
            reason,
            duration: durationNumber,
            date: new Date()
        });

        const dateBanLifted = new Date();
        dateBanLifted.setDate(dateBanLifted.getDate() + durationNumber);

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

    await Promise.all(
      bans.map((ban) => expireBanAndReactivateUser(ban))
    );

    const updatedBans = await BanModel.findAll({
      include: [
        {
          model: Person,
          as: "bannedUser",
          attributes: ["id", "name", "email", "status", "dateBanLifted"],
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
        userId: id,
      },
    });

    await Promise.all(
      bans.map((ban) => expireBanAndReactivateUser(ban))
    );

    const updatedBans = await BanModel.findAll({
      where: {
        userId: id,
      },
    });

    res.json(updatedBans);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los bans del usuario",
      error: error.message,
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

        const user = await Person.findByPk(ban.userId);

        if (!user) {
            return res.status(404).json({
                message: 'El usuario no existe'
            });
        }

        await user.update({
            dateBanLifted: null,
            status: true,
        });

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