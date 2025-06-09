import axios from "../utils/axiosCustomize";

const getAllAccountService = async () => {
  const res = await axios.get("/auth/get-all-account");
  return res.data;
};

const updateAccountStatusService = async (MaTK, TrangThai) => {
  const res = await axios.put("/auth/update-account-status", {
    MaTK,
    TrangThai,
  });
  return res.data;
};

export { getAllAccountService, updateAccountStatusService };
