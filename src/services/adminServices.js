import axios from "../utils/axiosCustomize";

const getAdminService = async () => {
  const res = await axios.get("/admin/get-admin");
  return res.data;
};

const updateAdminService = async (data) => {
  const res = await axios.put("/admin/update-admin", data);
  return res.data;
};

export { getAdminService, updateAdminService };
