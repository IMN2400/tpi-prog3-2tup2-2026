import { useEffect, useState } from "react";
import React from 'react'
import { Button, Card, Col, Form, FormGroup, Row, Modal } from "react-bootstrap";


const Users = () => {
    const [users, setUser] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/persons")
            .then(res => res.json())
            .then(data => setUser(data))
            .then(error => console.error(error))
    }, [])

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Estado</th>
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
                                <button
                                    variant="warning"
                                    onClick={}>
                                    Banear
                                </button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default users;