import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useRequireAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      });
      return;
    }

    callback();
  };

  return { requireAuth };
};
