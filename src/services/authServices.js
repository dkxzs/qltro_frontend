import axios from "../utils/axiosCustomize";

const SignIn = async (email, password) => {
  const res = await axios.post("/auth/login", { email, password });
  return res.data;
};

export { SignIn };
