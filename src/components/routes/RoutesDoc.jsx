import {BrowserRouter, Route, Routes, Navigate} from "react-router"
import NotFound from "../not_found/NotFound"
import MainPage from "../main_page/MainPage"
import LogIn from "../login/LogIn"
import Header from "../header/Header"
import Footer from "../footer/Footer"
import Protected from "../protected/Protected"
import { ToastContainer } from 'react-toastify';


const RoutesDoc = () => {
    return  (
    <> 
        <BrowserRouter>
        <Header />
        <Routes>
            <Route path="login" element={<LogIn />}/>
            <Route element={<Protected />} >
                <Route path={"main", "/", "home"} element={<MainPage />}/>
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer />
        </BrowserRouter>
    </>)
    
}


export default RoutesDoc