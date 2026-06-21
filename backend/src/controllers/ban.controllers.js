import BanModel from '../models/Bans.js';
import { Person } from '../models/Person.js';
import { calculateBanTime } from "../helpers/ban.calculate.js";

export const createBan = async (req, res) => {
  try {
    const { userId, reason, duration } = req.body;
    const adminId = req.user.id;

    if (!userId || !reason || !duration) {
      return res.status(400).json({
        message: "Usuario, motivo y duración son obligatorios",
      });
    }

    const activeBan = await BanModel.findOne({
      where: {
        userId,
        estado: "activo",
      },
    });

    if (activeBan) {
      return res.status(400).json({
        message: "El usuario ya tiene un ban activo",
      });
    }

    const ban = await BanModel.create({
      userId,
      adminId,
      reason,
      duration,
      date: new Date(),
      estado: "activo",
    });

    res.status(201).json(ban);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear ban",
      error: error.message,
    });
  }
};


export const getBans = async (req, res) => {
  try {
    const bans = await BanModel.findAll({
      attributes: ["id", "reason", "date", "duration", "estado"],
      include: [
        {
          model: Person,
          as: "bannedUser",
          attributes: ["nombre"],
        },
        {
          model: Person,
          as: "adminUser",
          attributes: ["nombre"],
        },
      ],
    });

    const bansWithTime = await Promise.all(
      bans.map(async (ban) => {
        const banData = ban.get({ plain: true });

        const banTime = calculateBanTime(
          banData.date,
          banData.duration
        );

        if (banData.estado === "activo" && banTime.isExpired) {
          await ban.update({
            estado: "expirado",
          });

          banData.estado = "expirado";
        }

        return {
          ...banData,
          remainingDays: banTime.remainingDays,
          remainingText:
            banData.estado === "desbanneado"
              ? "Usuario desbaneado"
              : banTime.remainingText,
          expirationDate: banTime.expirationDate,
        };
      })
    );

    res.json(bansWithTime);
  } catch (error) {
    console.log("Error al obtener bans:", error);

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

    const bansWithTime = await Promise.all(
      bans.map(async (ban) => {
        const banData = ban.get({ plain: true });

        const banTime = calculateBanTime(
          banData.date,
          banData.duration
        );

        if (banData.estado === "activo" && banTime.isExpired) {
          await ban.update({
            estado: "expirado",
          });

          banData.estado = "expirado";
        }

        return {
          ...banData,
          remainingDays: banTime.remainingDays,
          remainingText:
            banData.estado === "desbanneado"
              ? "Usuario desbaneado"
              : banTime.remainingText,
          expirationDate: banTime.expirationDate,
        };
      })
    );

    res.json(bansWithTime);
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