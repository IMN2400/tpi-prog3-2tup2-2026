import dayjs from 'dayjs';
import { Person } from '../models/models.js';

export const calculateAge = (date) => {
    let newDate = dayjs(date)
    const today = dayjs()
    const years = today.diff(newDate, 'years')
    return years;
}

const updateAge = async (userId) => {
    const person = await Person.findByPk(userId);
    if (!person) return;
    const newAge = calculateAge(person?.dob);
    if (person.age !== newAge) {
        await person.update({age: newAge});
    };
    return;
};

export const updateSelfAge = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        await updateAge(userId);
    } catch (error) {
        console.error(`Error al actualizar la edad en base de datos: ${error}`);
    } finally {next();};
};

export const updateOtherAge = async (req, res, next) => {
    try {
        const userId = req.params?.id;
        await updateAge(userId)
    } catch (error) {
        console.error(`Error al actualizar la edad en base de datos: ${error}`);
    } finally {next();}
};