import { useState } from "react"
import { Card } from "react-bootstrap"
import ForumDisplay from "../forumDisplay/ForumDisplay"

const Forums = ({forumsProp}) => {
    const [forums, setBooks] = useState(forumsProp)
    
    return <section className="display-flex">
    {forums.map((forum)=> {ForumDisplay(forum)} )}
    </section>
}



export default Forums 