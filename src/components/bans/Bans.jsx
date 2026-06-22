import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { Form } from 'react-router-dom'
import { useState, useEffect } from "react"


const Bans = () => {
    const [bans, setBans] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/bans")
            .then(res => res.json())
            .then(data => setBans(data))
            .catch(error => console.error(error))
    }, [])

    const getRemainingDays = (date, duration) => {

        const banDate = new Date(date);

        const expirationDate = new Date(banDate);

        expirationDate.setDate(
            expirationDate.getDate() + duration
        );

        const today = new Date();

        const diffTime =
            expirationDate - today;

        const diffDays =
            Math.ceil(
                diffTime / (1000 * 60 * 60 * 24)
            );

        if (diffDays <= 0) {
            return 'Ban expirado';
        }

        return diffDays === 1
            ? '1 día restante'
            : `${diffDays} días restantes`;
    };

    const desban = async (ban) => {

        const banDate = new Date(ban.date);

        const expirationDate =
            new Date(banDate);

        expirationDate.setDate(
            expirationDate.getDate()
            + ban.duration
        );

        const today = new Date();

        const diffTime =
            expirationDate - today;

        const diffDays = Math.ceil(
            diffTime / (1000 * 60 * 60 * 24)
        );

        let newDuration = ban.duration - diffDays;

        if (newDuration < 0) {
            newDuration = 0;
        }

        try {

            const respuesta = await fetch(
                `http://localhost:3000/bans/${ban.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body: JSON.stringify({
                        duration: newDuration,
                        estado: 'desbanneado'
                    })
                }
            );

            if (respuesta.ok) {

                alert(
                    'Ban actualizado exitosamente'
                );

            } else {

                alert(
                    'Error al actualizar el ban'
                );
            }

        } catch (error) {

            console.error(
                'Error de conexión:',
                error
            );
        }
    };

    return (
        <div className='container mt-4'>
            <h1 className='mb-4' style={{ color: 'green' }}>Lista de baneos</h1>
            <Table striped bordered hover>
                <thead className='table-success'>
                    <tr>
                        <th>ID</th>
                        <th>ID del usuario</th>
                        <th>ID Admin</th>
                        <th>Motivo</th>
                        <th>Fecha de baneo</th>
                        <th>Duracion</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {bans.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.userId}</td>
                            <td>{item.adminId}</td>
                            <td>{item.reason}</td>
                            <td>{new Date(item.date).toLocaleDateString('es-AR')}</td>
                            <td>{item.duration === 1
                                ? '1 día'
                                : `${item.duration} días`}
                                <br />(
                                {getRemainingDays(
                                    item.date,
                                    item.duration
                                )})
                            </td>
                            <td>{item.estado} </td>
                            <td>
                                {item.estado === "activo" &&(
                                <button
                                    variant="warning"
                                    onClick={() => desban(item)}>
                                    Desbanear
                                </button>
                            )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Bans;