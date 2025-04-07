import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRouteAdmin = ({ children }) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const isAdmin = useSelector((state) => state.user.account?.isAdmin);
  if (!isLogin) {
    return <Navigate to="/admin/login" />;
  }
  if (isAdmin !== 0) {
    return <Navigate to="/not-found" />;
  }
  return children;
};

export default ProtectedRouteAdmin;
