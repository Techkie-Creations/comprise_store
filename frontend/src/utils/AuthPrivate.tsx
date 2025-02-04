import { PropsWithChildren, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
import NotFound from "../Pages/NotFound";

const AuthPrivate = ({ children }: PropsWithChildren) => {
  const context = useContext(AuthContext);

  if (context.user.success) return <NotFound />;
  return children;
};

export default AuthPrivate;
