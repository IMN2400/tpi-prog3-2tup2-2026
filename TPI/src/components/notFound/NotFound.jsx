import React from 'react'
import { Button } from 'react-bootstrap'
import {Form, useNavigate } from 'react-router'
import { useState, useEffect } from 'react';
import img1 from '../../assets/notFound/img1.jpg';
import gif1 from '../../assets/notFound/gif1.gif'
import img2 from '../../assets/notFound/img2.jpg';

const images = [img1, gif1, img2];

const messages = [
  "Te perdiste 👀",
  "No hay nada acá...",
  "404: el vacío te mira de vuelta",
  "Este no es el foro que buscabas",
  "Ups... rompiste el internet (no realmente)"
];

const randomMessage = messages[Math.floor(Math.random() * messages.length)];
const NotFound = () => {
    const [image, setImage] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setImage(images[randomIndex]);
  }, []);

    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate("/"); 
    }

    return (
        <div>
            <h1>404 - Página no encontrada</h1>
            <p>{randomMessage}</p>
            <img src={image} alt="random" />
            <br />
            <Button onClick={handleBackToLogin}>
                Volver al inicio de sesión
            </Button>
        </div>
    )
}

export default NotFound