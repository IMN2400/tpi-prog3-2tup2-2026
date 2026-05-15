import { useState } from "react";
import { AuthenticationContext } from "./auth.context";

// Buscamos el token en localStorage si es que hay. Si no, queda definido como
// null. Se le podría dar un valor predeterminado, mediante
// const currentToken = localStorage.getItem("GranForoAuthToken") || "valor"
// pero no hace falta.

const currentToken = localStorage.getItem("GranForoAuthToken");

// Este es el contexto mediante el cual podemos pasar funciones para hacer 
// login y logout, así como el valor del token. Toma como parámetro lo que sea
// el objeto que envuelva.

export const AuthContextProvider = (children) => {
    const [token, setToken] = useState(currentToken);

// Esta función administra el login.  Guarda el token en localStorage y
// actualiza el valor del token en el contexto.

    const HandleLogin = (token) => {
        localStorage.setItem("GranForoAuthToken", token);
        setToken(Token);
        console.log("Login exitoso.");
    };

// Esta función administra el logout. Borra el token del localStorage y
// elimina el valor del token en el contexto, reemplazándolo con null.

    const HandleLogout = (token) => {
        localStorage.removeItem("GranForoAuthToken");
        setToken(null);
    };
} ;