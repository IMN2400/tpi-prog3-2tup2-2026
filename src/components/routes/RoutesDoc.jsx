import {BrowserRouter, Route, Routes, Navigate} from "react-router"
import NotFound from "../not_found/NotFound"
import MainPage from "../main_page/MainPage"
import LogIn from "../login/LogIn"
import Header from "../header/Header"
import Footer from "../footer/Footer"


const RoutesDoc = () => {

    return  (
    <> 
    <Header />
    <BrowserRouter>
    <Routes>
        <Route path="main" element={<MainPage />}/>
        <Route path="login" element={<LogIn />}/>
        <Route path="*" element={<NotFound />} />
    </Routes></BrowserRouter>
    <Footer />
    </>)
    
}


export default RoutesDoc