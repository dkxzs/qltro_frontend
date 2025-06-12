import axios from "../utils/axiosCustomize.js";

export const getAllExpensesService = async () => {
  const res = await axios.get("/expense/get-all-expense");
  return res.data;
};

export const getExpensesByHouseService = async (houseId) => {
  const res = await axios.get(`/expense/get-expenses-by-house/${houseId}`);
  return res.data;
};

export const getExpensesByHouseAndRoomService = async (houseId, roomId) => {
  const res = await axios.get(
    `/expense/get-expenses-by-house-and-room/${houseId}/${roomId}`
  );
  return res.data;
};

export const getExpensesByRoomService = async (roomId) => {
  const res = await axios.get(`/expense/get-expenses-by-room/${roomId}`);
  return res.data;
};

export const getExpensesByMonthService = async (month, year) => {
  const res = await axios.get(
    `/expense/get-expenses-by-month/${month}/${year}`
  );
  return res.data;
};

export const createExpenseService = async (data) => {
  try {
    const res = await axios.post("/expense/create-expense", data);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi tạo chi phí phát sinh" }
    );
  }
};

export const updateExpenseService = async (id, data) => {
  try {
    const res = await axios.put(`/expense/update-expense/${id}`, data);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Lỗi khi cập nhật chi phí phát sinh",
      }
    );
  }
};

export const deleteExpenseService = async (id) => {
  try {
    const res = await axios.delete(`/expense/delete-expense/${id}`);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi xóa chi phí phát sinh" }
    );
  }
};

export const getExpenseByMonthYearService = async (month, year) => {
  const res = await axios.get(
    `/expense/get-expenses-by-month-year/${month}/${year}`
  );
  return res.data;
};
