import {BrowserRouter, Route, Routes} from "react-router-dom"
import NotFound from "../not_found/NotFound"
import MainPage from "../main_page/MainPage"
import LogIn from "../login/LogIn"
import Header from "../header/Header"
import Footer from "../footer/Footer"
import Protected from "../protected/Protected"
import { ToastContainer } from 'react-toastify';
import Register from "../register/Register";


const RoutesDoc = () => {
    return  (
    <> 
        <BrowserRouter>
        <Header />
        <Routes>
            <Route path="login" element={<LogIn />}/>
            <Route path="/register" element={<Register />} />
            <Route element={<Protected />} >
                <Route path="/" element={<MainPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/home" element={<MainPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer />
        </BrowserRouter>
    </>)
    
}


export default RoutesDoc