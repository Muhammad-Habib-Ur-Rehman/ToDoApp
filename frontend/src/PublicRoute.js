import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const PublicRoute = ({ children }) => {
  const { token } = React.useContext(AuthContext);
  return !token ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;
