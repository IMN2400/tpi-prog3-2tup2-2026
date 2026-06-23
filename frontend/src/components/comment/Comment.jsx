import { Card } from "react-bootstrap"

const Comment = (comment) => {
    const [text, date, responses, likes, user] = comment
    return <Card className="float-right">
        <Card.Title>{date}, {user}</Card.Title>
        <Card.Body>{text}</Card.Body>
        <Card.Footer>{likes}♥️</Card.Footer>
    </Card>
}



export default Comment