import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { Form } from 'react-router-dom'
//import { useState, useEffect } from "react"


const Bans = () => {

    const li = [
        {idBan:1, idUsuario:123, idAdmin: 33, reason:'Me pinto', start:'2026-012-31', duration: 3 },
        {idBan:2, idUsuario:122, idAdmin: 32, reason:'Me insulto', start:'2026-06-01', duration: 32},
        {idBan:3, idUsuario:122, idAdmin: 33, reason:'Insulto a otro usuario', start:'2033-06-04', duration: 365}
    ]
/*--------------------------------------------------------------------------------------------------------------
    const [bans, setBans] = useState([])

    useEffect(()=>{
        fetch("http://localhost:3000/bans")
        .then(res =>res.json())
        .then(data =>setBans(data))
    }, [])

*/
//----------------------------------------------------------------------------------------------------------------
        const modificarBan = (id) => {
        console.log("Modificar ban:", id)
        
    }
    return (
        <div className='container mt-4'>
            <h1 className='mb-4'>Lista de baneos</h1>
            <Table striped bordered hover>
                <thead className='table-dark'>
                    <tr>
                        <th>ID</th>
                        <th>ID del usuario</th>
                        <th>ID Admin</th>
                        <th>Motivo</th>
                        <th>Fecha de baneo</th>
                        <th>Duracion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {li.map((item) => (
                        <tr key={item.idBan}>
                            <td>{item.idBan}</td>
                            <td>{item.idUsuario}</td>
                            <td>{item.idAdmin}</td>
                            <td>{item.reason}</td>
                            <td>{item.start}</td>
                            <td>{item.duration} dias</td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => modificarBan(item.idBan)}
                                >
                                    Modificar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Bans;