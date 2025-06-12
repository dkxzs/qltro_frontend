import axios from "../utils/axiosCustomize.js";

const getAllDepositService = async () => {
  const res = await axios.get("/deposit/get-all-deposit");
  return res.data;
};

const createDepositService = async (data) => {
  try {
    const res = await axios.post("/deposit/create-deposit", data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo đặt cọc" };
  }
};

const updateDepositService = async (data) => {
  try {
    const res = await axios.put("/deposit/update-deposit", data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi cập nhật đặt cọc" };
  }
};

const deleteDepositService = async (id) => {
  try {
    const res = await axios.delete(`/deposit/delete-deposit/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi xóa đặt cọc" };
  }
};

const getDepositByRoomIdService = async (roomId) => {
  const res = await axios.get(`/deposit/get-deposit-by-roomId/${roomId}`);
  return res.data;
};

export {
  getAllDepositService,
  createDepositService,
  updateDepositService,
  deleteDepositService,
  getDepositByRoomIdService,
};
