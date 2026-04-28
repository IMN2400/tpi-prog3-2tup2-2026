import {BrowserRouter, Route, Routes, Navigate} from "react-router"
import NotFound from "../not_found/NotFound"
import MainPage from "../main_page/MainPage"
import LogIn from "../login/LogIn"


const Routes = () => {

    return <>
    <Route path="main" element={<MainPage />}/>
    <Route path="login" element={<LogIn />}/>
    <Route path="*" element={<NotFound />} />
    </>
}


export default Routes