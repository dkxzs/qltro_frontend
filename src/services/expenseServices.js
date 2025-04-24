import axios from "../utils/axiosCustomize";

// Lấy tất cả chi phí phát sinh
export const getAllExpensesService = async () => {
  const res = await axios.get("/expense/get-all-expense");
  return res.data;
};

// Lấy chi phí phát sinh theo nhà
export const getExpensesByHouseService = async (houseId) => {
  const res = await axios.get(`/expense/get-expenses-by-house/${houseId}`);
  return res.data;
};

// Lấy chi phí phát sinh theo nhà và phòng
export const getExpensesByHouseAndRoomService = async (houseId, roomId) => {
  const res = await axios.get(
    `/expense/get-expenses-by-house-and-room/${houseId}/${roomId}`
  );
  return res.data;
};

// Lấy chi phí phát sinh theo phòng
export const getExpensesByRoomService = async (roomId) => {
  const res = await axios.get(`/expense/get-expenses-by-room/${roomId}`);
  return res.data;
};

// Lấy chi phí phát sinh theo tháng/năm
export const getExpensesByMonthService = async (month, year) => {
  const res = await axios.get(
    `/expense/get-expenses-by-month/${month}/${year}`
  );
  return res.data;
};

// Tạo chi phí phát sinh mới
export const createExpenseService = async (data) => {
  const res = await axios.post("/expense/create-expense", data);
  return res.data;
};

// Cập nhật chi phí phát sinh
export const updateExpenseService = async (id, data) => {
  const res = await axios.put(`/expense/update-expense/${id}`, data);
  return res.data;
};

// Xóa chi phí phát sinh
export const deleteExpenseService = async (id) => {
  const res = await axios.delete(`/expense/delete-expense/${id}`);
  return res.data;
};
