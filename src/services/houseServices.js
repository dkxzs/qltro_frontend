import axios from "../utils/axiosCustomize";

const getAllHouseService = async () => {
  const res = await axios.get("/house/get-all-house");
  return res.data;
};

const createHouseService = async (data) => {
  const res = await axios.post("/house/create-house", data);
  return res.data;
};

const updateHouseService = async (id, data) => {
  const res = await axios.put(`/house/update-house/${id}`, data);
  return res.data;
};

const deleteHouseService = async (id) => {
  try {
    const res = await axios.delete(`/house/delete-house/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi xóa nhà" };
  }
};

const checkHouseHasRentService = async (id) => {
  const res = await axios.get(`/house/check-has-rent/${id}`);
  return res.data;
};

const getHouseByAccountIdService = async (id) => {
  const res = await axios.get(`/house/get-house-by-id/${id}`);
  return res.data;
};

export {
  checkHouseHasRentService,
  createHouseService,
  deleteHouseService,
  getAllHouseService,
  getHouseByAccountIdService,
  updateHouseService,
};
