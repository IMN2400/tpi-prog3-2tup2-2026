import { useEffect, useState } from "react";
import React from 'react'
import { Button, Card, Col, Form, FormGroup, Row, Modal, Table } from "react-bootstrap";


const Users = () => {
    const [users, setUser] = useState([{
        id: 1,
        nombre: "Leandro",
        correo: "test@test.com",
        estado: "activo"
    }]);
/*
    useEffect(() => {
        fetch("http://localhost:3000/persons")
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(error =>
                console.error(error)
            )
    }, [])
*/

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nombre}</td>
                            <td>{item.correo}</td>
                            <td>{item.estado}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => console.log("click")}>
                                    Banear
                                </Button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Users;