import axios from "../utils/axiosCustomize";

const SignIn = async (email, password) => {
  const res = await axios.post("/auth/login-account", {
    TenTK: email,
    MatKhau: password,
  });
  if (res.data.EC === 0) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        accessToken: res.data.DT.accessToken,
        LoaiTaiKhoan: res.data.DT.LoaiTaiKhoan,
      })
    );
  }
  return res.data;
};

const changePassword = async (TenTK, currentPassword, newPassword) => {
  const res = await axios.post("/auth/change-password", {
    TenTK,
    MatKhauCu: currentPassword,
    MatKhauMoi: newPassword,
  });
  return res.data;
};

const requestPasswordReset = async (TenTK) => {
  const res = await axios.post("/auth/request-password-reset", {
    TenTK,
  });
  return res.data;
};

const confirmPasswordReset = async (TenTK, otp, newPassword) => {
  const res = await axios.post("/auth/confirm-password-reset", {
    TenTK,
    otp,
    newPassword,
  });
  return res.data;
};

export { SignIn, changePassword, requestPasswordReset, confirmPasswordReset };
