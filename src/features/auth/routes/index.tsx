import { Route, Routes } from "react-router-dom";

import { Login } from "./Login";
import { Register } from "./Register";
import { Verify } from "./Verify";
import { Logout } from "./Logout";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="verify" element={<Verify />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
    </Routes>
  );
};
