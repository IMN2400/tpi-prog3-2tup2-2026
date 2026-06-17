import Forums from '../forums/Forums'
import { useFetchFromAPI } from '../../services/fetch/UseFetchFromAPI'

const MainPage = () => {
    const fetchedForums = useFetchFromAPI("forums")
    return <>
            <Forums forumsProp={fetchedForums} />
        </>
}

export default MainPage