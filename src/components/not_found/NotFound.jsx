import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router"

const NotFound = () => {
    const navigate = useNavigate();
    const goToLogin = () => {navigate("/login")}
    const goToMain = () => {navigate("/main")}
    return (<div className="text-center mt-3" >
    <img src="../404error.png" width="60%" />
    <h1>¡Mirá dónde te viniste a meter!</h1>
    <h3>Te soy sincero, no tengo idea de como hiciste para terminar acá. <br/> Felicitaciones, che.</h3>
    <Button variant="primary" onClick={goToMain}>Volver a la página de inicio</Button>
    <Button variant="secondary" onClick={goToLogin}>Ir al inicio de sesión</Button>
    </div>)
}

export default NotFound;