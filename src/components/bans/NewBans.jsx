import React from 'react'
import { Button, Card, Col, Form, FormGroup, Row, Modal } from "react-bootstrap";
import { useState } from "react"

const NewBan = ({ userId, onClose }) => {

    const [formData, setFormData] = useState({
        userId: userId,
        adminId: '',
        reason: '',
        duration: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/bans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: Number(formData.userId),
                    adminId: Number(formData.adminId),
                    reason: formData.reason,
                    duration: Number(formData.duration)
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Ban creado correctamente');

                console.log(data);

                setFormData({
                    userId: '',
                    adminId: '',
                    reason: '',
                    duration: ''
                });

            } else {
                alert(data.message || 'Error al crear el ban');
            }

        } catch (error) {
            console.error(error);
            alert('Error conectando con el servidor');
        }
    };

    return (
        <div className="d-flex justify-content-center mt-5">

            <Card
                className="p-4 shadow bg-success text-light"
                style={{ width: '700px' }}
            >
                <Card.Body>

                    <h2 className="text-center mb-4">
                        Nuevo Ban
                    </h2>

                    <Form onSubmit={handleSubmit}>

                        <Row>

                            <Col md={6}>
                                <FormGroup className="mb-3">

                                    <Form.Label>ID Usuario</Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="userId"
                                        readOnly
                                        value={formData.userId}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>

                            <Col md={6}>
                                <FormGroup className="mb-3">

                                    <Form.Label>ID Admin</Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="adminId"
                                        value={formData.adminId}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ingrese su ID"
                                    />
                                </FormGroup>
                            </Col>

                        </Row>

                        <FormGroup className="mb-3">

                            <Form.Label>Motivo</Form.Label>

                            <Form.Control
                                type="text"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                placeholder="Ej: comportamiento ofensivo"
                            />
                        </FormGroup>

                        <FormGroup className="mb-4">

                            <Form.Label>Duración</Form.Label>

                            <Form.Control
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                placeholder="Cantidad de días"
                            />
                        </FormGroup>

                        <Row>

                            <Col md={6}>
                                <Button
                                    variant='danger'
                                    type='submit'
                                    className="w-100"
                                >
                                    Banear
                                </Button>
                            </Col>

                            <Col md={6}>
                                <Button
                                    variant='secondary'
                                    type='button'
                                    onClick={onClose}
                                >
                                    Cancelar
                                </Button>
                            </Col>

                        </Row>

                    </Form>

                </Card.Body>
            </Card>
        </div>
    );
};
export default NewBan