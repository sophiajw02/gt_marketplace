import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const { logoutFn } = useAuth();

  useEffect(() => {
    logoutFn();
  }, []);

  return <></>;
};

export default Logout;
