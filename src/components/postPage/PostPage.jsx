import { Card } from "react-bootstrap"
import Post from "../post/Post"
import { useFetchFromAPI } from "../../services/fetch/UseFetchFromAPI"

const PostPage = (PostId) => {
    const { title, userId, body, postDate } = useFetchFromAPI(`/posts/${PostId}`)
    const usuario = getUserById(userId)
    return <section>
        <Card>
            <Card.Title className="full-width">{title}</Card.Title>
            <Card.Subtitle>Posteado por {usuario}, {postDate}</Card.Subtitle>
            <Card.Body>
                <section>
                    {body}
                </section>
            </Card.Body>
        </Card>
    </section>
}



export default PostPage