import { useFetchFromAPI } from "../../services/fetch/UseFetchFromAPI"

const ForumPage = (forumId)=>{
    const posts = useFetchFromAPI(`/posts/${forumId}`)
    return <>
        {posts.map((item)=><Post postId={item} />)}
    </>
}


export default ForumPage