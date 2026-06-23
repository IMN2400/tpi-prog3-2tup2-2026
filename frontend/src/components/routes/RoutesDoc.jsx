import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import Protected from "../protected/Protected";

import MainPage from "../main_page/MainPage";
import LogIn from "../login/LogIn";
import Register from "../register/Register";
import NotFound from "../notfound/NotFound";

import ForumListPage from "../ForumListPage/ForumListPage";
import ForumPage from "../forumPage/ForumPage";
import PostPage from "../postPage/PostPage";

import NewForum from "../newForum/NewForum";
import NewPost from "../newPost/NewPost";

import Bans from "../bans/Bans";
import NewBans from "../bans/NewBans";
import Users from "../usersList/UserList";

const RoutesDoc = () => {
  return (
    <BrowserRouter>
      <Header />

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

        {/* Rutas protegidas */}
        <Route element={<Protected />}>
          <Route path="/newforum" element={<NewForum />} />
          <Route path="/forums/:forumId/posts/new" element={<NewPost />} />

          <Route path="/bans" element={<Bans />} />
          <Route path="/newban" element={<NewBans />} />
          <Route path="/users" element={<Users />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <ToastContainer />
    </BrowserRouter>
  );
};

export default RoutesDoc;