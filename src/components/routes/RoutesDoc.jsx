import {BrowserRouter, Route, Routes, Navigate} from "react-router"
import NotFound from "../not_found/NotFound"
import MainPage from "../main_page/MainPage"
import LogIn from "../login/LogIn"
import Header from "../header/Header"
import Footer from "../footer/Footer"


const RoutesDoc = () => {

    return  (
    <> 
    <BrowserRouter>
    <Header />
    <Routes>
        <Route path={"main", "/", "home"} element={<MainPage />}/>
        <Route path="login" element={<LogIn />}/>
        <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
    </BrowserRouter>
    </>)
    
}


export default RoutesDoc