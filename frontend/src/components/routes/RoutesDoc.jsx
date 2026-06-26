import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import Protected from "../protected/Protected";

import MainPage from "../main_page/MainPage";
import LogIn from "../login/LogIn";
import Register from "../register/Register";
import NotFound from "../notFound/NotFound";

import ForumListPage from "../ForumListPage/ForumListPage";
import ForumPage from "../forumPage/ForumPage";
import PostPage from "../postPage/PostPage";

import NewForum from "../newForum/NewForum";
import NewPost from "../newPost/NewPost";

import Bans from "../bans/Bans";
import NewBans from "../bans/NewBans";
import Users from "../usersList/UserList";
import ProtectedOnlyAdmin from "../protected/ProtectedOnlyAdmin";
import ProtectedOnlySysAdmin from "../protected/ProtectedOnlySysAdmin";

const RoutesDoc = () => {
  return (
    <BrowserRouter>
      <Header />
      <ToastContainer 
        position="top-right"
        autoClose={4000}
        limit={3}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition={Slide}
/>

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<MainPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/home" element={<MainPage />} />

        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />

        <Route path="/foros" element={<ForumListPage />} />
        <Route path="/forum/:forumId" element={<ForumPage />} />
        <Route path="/post/:postId" element={<PostPage />} />

        {/* Rutas protegidas: solo usuarios logueados pueden entrar */}
        <Route element={<Protected />}>
          <Route path="/forums/:forumId/posts/new" element={<NewPost />} />
          {/* Ruta de SYSADMIN: solo SYSADMIN puede acceder*/}
          <Route element={<ProtectedOnlySysAdmin />}>
            <Route path="/newforum" element={<NewForum />} />
          </Route>
          {/* Rutas de Admin: solo ADMIN y SYSADMIN pueden acceder. */}
          <Route element={<ProtectedOnlyAdmin />}>
            <Route path="/bans" element={<Bans />} />
            <Route path="/newban" element={<NewBans />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default RoutesDoc;
