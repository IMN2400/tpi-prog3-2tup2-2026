import {Card, Button, CardTitle} from "react-bootstrap"
import { useNavigate } from "react-router"

const NotFound = () => {
    const navigate = useNavigate();
    const goToLogin = () => {navigate("/LogIn")}
    const goToMain = () => {navigate("/MainPage")}
    return 
    <div className="text-center mt-3">
    <image href="https://upload.wikimedia.org/wikipedia/commons/c/cc/Woman_looking_confused_while_sitting_in_an_armchair_with_a_laptop_in_her_lap._%2851535516007%29.jpg" width="60vw" />
    <h1>¡Mirá dónde te viniste a meter!</h1>
    <h3>Te soy sincero, no tengo idea de como hiciste para terminar acá. Felicitaciones, che.</h3>
    <Button variant="primary" onClick={goToMain}>Volver a la página de inicio</Button>
    <Button variant="secondary" onClick={goToLogin}>Ir al inicio de sesión</Button>
    </div>
}

export default NotFound;