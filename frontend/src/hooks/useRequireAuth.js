import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRef, useEffect } from "react";
import { toast } from "react-toastify";

export const useRequireAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const requireAuth = (callback) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isAuthenticated) {
      toast.warning(
        "Debe iniciar sesión para realizar esta acción."
      );
      
      timerRef.current = setTimeout(() => {
        navigate("/login", {
          state: { from: location.pathname },
        });
      }, 1000);
      return; 
    }


    callback();
  };

  return { requireAuth };
};