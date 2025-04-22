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
  const res = await axios.delete(`/house/delete-house/${id}`);
  return res.data;
};

// Thêm hàm kiểm tra nhà có phòng đang được thuê không
const checkHouseHasRentService = async (id) => {
  const res = await axios.get(`/house/check-has-rent/${id}`);
  return res.data;
};

export {
  getAllHouseService,
  createHouseService,
  updateHouseService,
  deleteHouseService,
  checkHouseHasRentService, 
};
