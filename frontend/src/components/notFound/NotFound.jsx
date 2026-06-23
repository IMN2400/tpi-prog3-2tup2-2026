import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import img1 from '../../assets/notFound/img1.jpg';
import gif1 from '../../assets/notFound/gif1.gif'
import img2 from '../../assets/notFound/img2.jpg'
import img3 from '../../assets/notFound/img3.png'
const images = [img1, gif1, img2, img3];

const messages = [
    "Te perdiste 👀",
    "No hay nada acá...",
    "404: el vacío te mira de vuelta",
    "Este no es el foro que buscabas",
    "Ups... rompiste el internet (no realmente)",
    "¡Mirá dónde te viniste a meter!",
    "Te soy sincero... no tengo idea de como hiciste para terminar acá. Felicitaciones, che."
];


const randomMessage = messages[Math.floor(Math.random() * messages.length)];
const NotFound = () => {
    const [image, setImage] = useState('');

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * images.length);
        setImage(images[randomIndex]);
    }, []);

    const navigate = useNavigate();
    const goToLogin = () => { navigate("/login") }
    const goToMain = () => { navigate("/main") }

    return (
        <div>
            <h1>404 - Página no encontrada</h1>
            <p
    style={{
        fontSize: '2rem',
        fontWeight: 'bold'
    }}
>
    {randomMessage}
</p>
            <img
                src={image}
                alt="random"
                style={{
                    width: "900px",
                    height: "auto"
                }}
            />
            <br />
            <ButtonGroup className='my-3 py-5' size='lg'>
                <Button variant="primary" className='mx-2 py-3' onClick={goToMain} >Volver a la página de inicio</Button>
                <Button variant="secondary" className='mx-2 py-3' onClick={goToLogin}>Ir al inicio de sesión</Button></ButtonGroup>
        </div>
    )
}

export default NotFound
