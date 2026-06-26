import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const ProtectedOnlySysAdmin = () => {
  const { isSysAdmin } = useAuth();

   if (!isSysAdmin) {
    toast.warning("Solo SYSADMIN tiene acceso.")
    return <Navigate to="/main" replace />;
  }

  return <Outlet />;
};

export default ProtectedOnlySysAdmin;
