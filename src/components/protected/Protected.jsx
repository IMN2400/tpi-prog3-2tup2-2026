import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthenticationContext } from "../services/auth/auth.context";
import { isTokenValid } from "../services/auth/auth.helpers";

const Protected = () => {
    const { token } = useContext(AuthenticationContext);

    if (!isTokenValid(token)) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default Protected;
