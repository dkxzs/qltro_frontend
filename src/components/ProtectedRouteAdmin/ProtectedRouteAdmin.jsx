import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRouteAdmin = ({ children }) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const role = useSelector((state) => state.user.account.LoaiTaiKhoan);

  if (!isLogin) {
    return <Navigate to="/admin/login" />;
  }
  if (!role || (role !== "admin" && role !== "nhanvien")) {
    toast.error("Bạn không có quyền truy cập trang admin!");
    return <Navigate to="/not-found" />;
  }
  return children;
};

export default ProtectedRouteAdmin;
