import { useParams } from "react-router"
import { useFetchFromAPI } from "../../services/fetch/UseFetchFromAPI"

const ForumPage = ()=>{
    const forumId = useParams();
    const forum = useFetchFromAPI(`/forum/${id}`)
    const posts = useFetchFromAPI(`/posts/${forumId}`);
    return <>
    <LesserHeader headerName={forum.nombre} />
        {posts.map((item)=><Post postId={item} />)}
    </>
}


export default ForumPage