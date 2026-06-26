import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const ProtectedOnlyAdmin = () => {
  const { isAdmin } = useAuth();

   if (!isAdmin) {
    toast.warning("Solo los administradores tienen acceso.")
    return <Navigate to="/main" replace />;
  }

  return <Outlet />;
};

export default ProtectedOnlyAdmin;
