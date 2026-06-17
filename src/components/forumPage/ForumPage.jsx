import { useParams } from "react-router"
import { useFetchFromAPI } from "../../services/fetch/UseFetchFromAPI"

const ForumPage = ()=>{
    const forumId = useParams();
    const posts = useFetchFromAPI(`/posts/${forumId}`);
    return <>
        {posts.map((item)=><Post postId={item} />)}
    </>
}


export default ForumPage