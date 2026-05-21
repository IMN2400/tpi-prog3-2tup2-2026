import { Card } from "react-bootstrap"

const Post = (post) => {
    const [title, user, comments, likes, date] = post
    return<Card>
        <Card.Title>
            {title}
        </Card.Title>
        <Card.Body>
            Creado por {user}, en {date}.<br/>
            {comments.length}💌 {likes}♥️
        </Card.Body>
    </Card>
}



export default Post