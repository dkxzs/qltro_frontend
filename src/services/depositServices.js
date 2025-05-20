import axios from "../utils/axiosCustomize";

const getAllDepositService = async () => {
  const res = await axios.get("/deposit/get-all-deposit");
  return res.data;
};

const createDepositService = async (data) => {
  const res = await axios.post("/deposit/create-deposit", data);
  return res.data;
};

const updateDepositService = async (data) => {
  const res = await axios.put("/deposit/update-deposit", data);
  return res.data;
};

const deleteDepositService = async (id) => {
  const res = await axios.delete(`/deposit/delete-deposit/${id}`);
  return res.data;
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
