import axios from "../utils/axiosCustomize";

const SignIn = async (email, password) => {
  const res = await axios.post("/auth/login-account", {
    TenTK: email,
    MatKhau: password,
  });
  return res.data;
};

export { SignIn };
