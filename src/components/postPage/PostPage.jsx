import { Card } from "react-bootstrap"
import Post from "../post/Post"
import { useFetchFromAPI } from "../../services/fetch/UseFetchFromAPI"
import { useNavigate } from "react-router"

const PostPage = (PostId) => {
    const { title, userId, body, postDate } = useFetchFromAPI(`/posts/${PostId}`)
    const usuario = getUserById(userId)
    const comments = useFetchFromAPI(`/comments/${postId}`)
    const navigate = useNavigate()
    return <section>
        <Card>
            <Card.Title className="full-width">{title}</Card.Title>
            <Card.Subtitle>Posteado por {usuario.nombre}, {postDate}</Card.Subtitle>
            <Card.Body>
                <section>
                    {body}
                </section>
            </Card.Body>
        </Card>
        <div className="padding-lg" />
        <div>
            {comments.map((item)=><Comment comment={item} />)}
        </div>
    </section>
}



export default PostPage