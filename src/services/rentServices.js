import axios from "../utils/axiosCustomize";

export const getAllRentService = async () => {
  const res = await axios.get("/rent/get-all-rent");
  return res.data;
};

export const createRentService = async (data) => {
  const res = await axios.post("/rent/create-rent", data);
  return res.data;
};

export const updateRentService = async (id, data) => {
  const res = await axios.put(`/rent/update-rent/${id}`, data);
  return res.data;
};

export const deleteRentService = async (id) => {
  const res = await axios.delete(`/rent/delete-rent/${id}`);
  return res.data;
};

// Thêm service mới để lấy dịch vụ của phòng
export const getRoomServicesService = async (roomId) => {
  const res = await axios.get(`/rent/get-room-services/${roomId}`);
  return res.data;
};