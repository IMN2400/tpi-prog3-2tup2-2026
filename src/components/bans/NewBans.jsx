import React from 'react'
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
//import { useState, useEffect } from "react"


const NewBan = () => {
    return (
        <div className="d-flex justify-content-center mt-5">
            <Card className="p-4 shadow bg-dark text-light">
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={3} >
                                <FormGroup className="mb-1">
                                    <Form.Label>ID Usuario</Form.Label>
                                    <Form.Control
                                        type="idUsuario"
                                        required
                                        placeholder="Ingrese el ID del usuario a bannear" />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup className="mb-1">
                                    <Form.Label>ID Admin</Form.Label>
                                    <Form.Control
                                        type="idAdmin"
                                        required
                                        placeholder="Ingrese su ID" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup className="mb-1">
                            <Form.Label>Motivo</Form.Label>
                            <Form.Control
                                type="Motivo"
                                required
                                placeholder="Motivo del ban Ej:'Comportamiento ofencibo'" />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Duracion</Form.Label>
                            <Form.Control
                                type='duration'
                                required
                                placeholder='De cuentos dias sera el baneo' />
                        </FormGroup>
                        <Row>
                            <Col md={3}>
                                <Button variant='primary' type='submit'>Banear</Button>
                            </Col>
                            <Col md={3}>
                                <Button variant='secondary' type='buttom'>Cancelar</Button>
                            </Col>
                        </Row>

                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default NewBan