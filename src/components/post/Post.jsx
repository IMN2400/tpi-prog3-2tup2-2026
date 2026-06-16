import { Card } from "react-bootstrap"
import { useFetchFromAPI } from "../../services/fetch/UseFetchFromAPI"

const Post = (PostId) => {

    const [title, userId, likeCount, postDate] = useFetchFromAPI(`/posts/${PostId}`)
    const user = useFetchFromAPI(`/users/${userId}`)
    return<Card>
        <Card.Title>
            {title}
        </Card.Title>
        <Card.Body>
            Creado por {user}, en {postDate}.<br/>
            {comments.length}💌 {likeCount}♥️
        </Card.Body>
    </Card>
}



export default Post