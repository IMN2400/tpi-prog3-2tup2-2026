import { useEffect, useState } from "react";
import React from 'react'
import NewBan from "../bans/NewBans";
import { Button, Card, Col, Form, FormGroup, Row, Modal, Table } from "react-bootstrap";


const Users = () => {
    const [showModal, setModal] = useState(false);
    const [search, setSearch] = useState('');

    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUser] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/persons")
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(error =>
                console.error(error)
            )
    }, [])

    const openBanModal = (user) => {

        setSelectedUser(user);
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
        setSelectedUser(null);
    };

    const filteredUsers =
    users.filter((user) => {

        const text =
            search.toLowerCase();

        return (
            user.id
                .toString()
                .includes(text)
            ||
            user.name
                .toLowerCase()
                .includes(text)
            ||
            user.email
                .toLowerCase()
                .includes(text)
        );
    });
    return (
        <div>
            <Form.Control
    type="text"
    placeholder="Buscar por ID, nombre o correo"
    value={search}
    onChange={(e) =>
        setSearch(e.target.value)
    }
/>
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
                    {filteredUsers.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td
                                className={
                                    item.estado
                                        ? "text-success fw-bold"
                                        : "text-danger fw-bold"
                                }
                            >
                                {item.estado
                                    ? "Activo"
                                    : "Baneado"}
                            </td>
                            <td>
                                {item.estado && (
                                    <Button
                                        variant="warning"
                                        onClick={() => openBanModal(item)}
                                    >
                                        Banear
                                    </Button>
                                )}
                            </td>
                        </tr>

                    ))}
                </tbody>
            </Table>

            <Modal
                show={showModal}
                onHide={closeModal}
                centered
            >

                <Modal.Header
                    closeButton
                >
                    <Modal.Title>
                        Banear usuario
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedUser && (<NewBan userId={selectedUser.id} onClose={closeModal} />)}
                </Modal.Body>

            </Modal>
        </div>
    )
}

export default Users;