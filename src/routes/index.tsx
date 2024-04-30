import { useNavigate, useRoutes } from "react-router-dom";
import { useAuth } from "@/hooks";
import { publicRoutes } from "./public";
import { protectedRoutes } from "./protected";
import { useEffect } from "react";

export const AppRoutes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user && !user.firebaseUser.emailVerified) {
      const currentPath = window.location.pathname;
      localStorage.setItem("preVerifyPath", currentPath);
      navigate("/verify");
      const verificationCheckInterval = setInterval(async () => {
        await user.firebaseUser.reload();
        if (user.firebaseUser.emailVerified) {
          clearInterval(verificationCheckInterval);
          const preVerifyPath = localStorage.getItem("preVerifyPath") || "/";
          localStorage.removeItem("preVerifyPath");
          navigate(preVerifyPath);
        }
      }, 5000);
      return () => clearInterval(verificationCheckInterval);
    }
  }, [user, loading]);

  const routes = [...publicRoutes, ...protectedRoutes];
  const element = useRoutes([...routes]);

  return <>{element}</>;
};
