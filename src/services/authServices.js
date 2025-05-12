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
        isAdmin: res.data.DT.VaiTro === 1,
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

export { SignIn, changePassword };
