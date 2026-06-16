import { Card } from 'react-bootstrap'
import Forums from '../forums/Forums'



const MainPage = () => {
    const fetchedForums = useFetchFromAPI("forums")
    return <>
            <Forums forumsProp={fetchedForums} />
        </>
}


export default MainPage