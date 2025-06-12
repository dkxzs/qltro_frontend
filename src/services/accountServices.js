import axios from "../utils/axiosCustomize.js";

const getAllAccountService = async () => {
  const res = await axios.get("/auth/get-all-account");
  return res.data;
};

const createAccountService = async (data) => {
  try {
    const res = await axios.post("/auth/create-account", data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo tài khoản" };
  }
};

const updateAccountStatusService = async (MaTK, TrangThai) => {
  try {
    const res = await axios.put("/auth/update-account-status", {
      MaTK,
      TrangThai,
    });
    return res.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Lỗi khi cập nhật trạng thái tài khoản",
      }
    );
  }
};

const logoutAccountService = async () => {
  const res = await axios.post("/auth/logout-account");
  return res.data;
};

const loginAccountService = async (data) => {
  try {
    const res = await axios.post("/auth/login-account", data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi đăng nhập" };
  }
};

const changePasswordService = async (data) => {
  try {
    const res = await axios.post("/auth/change-password", data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi đổi mật khẩu" };
  }
};

const requestPasswordResetService = async (data) => {
  try {
    const res = await axios.post("/auth/request-password-reset", data);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi yêu cầu đặt lại mật khẩu" }
    );
  }
};

const confirmPasswordResetService = async (data) => {
  try {
    const res = await axios.post("/auth/confirm-password-reset", data);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Lỗi khi xác nhận đặt lại mật khẩu",
      }
    );
  }
};

export {
  getAllAccountService,
  createAccountService,
  updateAccountStatusService,
  logoutAccountService,
  loginAccountService,
  changePasswordService,
  requestPasswordResetService,
  confirmPasswordResetService,
};
