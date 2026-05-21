import { Accordion, Button, Card } from "react-bootstrap"
import { useNavigate } from "react-router";


const ForumDisplay = (forum) => {
    const navigate = useNavigate()
    const [ id, name, admin, founder, description, rules ] = forum
    const adminsList = admin.map(ad => <li>{ad}</li>);
    const goToForum = () => {navigate(`/foros/${id}`)}
    return <Card>
        <Card.Title> {name} </Card.Title>
        <Card.Subtitle> {description} </Card.Subtitle>
        <Card.Body>
            <Accordion>
                <Accordion.Item>
                    <Accordion.Header>
                        Reglas
                    </Accordion.Header>
                    <Accordion.Body>
                        {rules}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>
                        Admins
                    </Accordion.Header>
                    <Accordion.Body>
                        <ul>{adminsList} </ul>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>
                        Fundador
                    </Accordion.Header>
                    <Accordion.Body>
                        Foro fundado por {founder}.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Button onClick={goToForum}>Ir al foro</Button>
        </Card.Body>
    </Card>
}


export default ForumDisplay