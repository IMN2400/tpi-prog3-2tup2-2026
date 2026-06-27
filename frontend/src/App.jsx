import RoutesDoc from "./components/routes/RoutesDoc";
import { ToastContainer, Slide } from "react-toastify";
import "./App.css";

function App() {
  return <>
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
  <RoutesDoc />;
  </>
}

export default App;