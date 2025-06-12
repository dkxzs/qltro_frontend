import axios from "../utils/axiosCustomize.js";

export const getAllElectricService = async () => {
  const res = await axios.get("/electric-water/electric/get-all");
  return res.data;
};

export const getElectricByRoomService = async (roomId) => {
  const res = await axios.get(`/electric-water/electric/get-by-room/${roomId}`);
  return res.data;
};

export const getElectricByMonthService = async (month, year) => {
  const res = await axios.get(
    `/electric-water/electric/get-by-month/${month}/${year}`
  );
  return res.data;
};

export const getAllRoomsWithElectricService = async (month, year) => {
  const res = await axios.get(
    `/electric-water/electric/get-all-rooms-with-electric/${month}/${year}`
  );
  return res.data;
};

export const getAllWaterService = async () => {
  const res = await axios.get("/electric-water/water/get-all");
  return res.data;
};

export const getWaterByRoomService = async (roomId) => {
  const res = await axios.get(`/electric-water/water/get-by-room/${roomId}`);
  return res.data;
};

export const getWaterByMonthService = async (month, year) => {
  const res = await axios.get(
    `/electric-water/water/get-by-month/${month}/${year}`
  );
  return res.data;
};

export const getAllRoomsWithWaterService = async (month, year) => {
  const res = await axios.get(
    `/electric-water/water/get-all-rooms-with-water/${month}/${year}`
  );
  return res.data;
};

export const createElectricWaterService = async (data) => {
  try {
    const res = await axios.post("/electric-water/create", data);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi tạo chỉ số điện nước" }
    );
  }
};

export const updateElectricWaterService = async (id, data) => {
  try {
    const res = await axios.put(`/electric-water/update/${id}`, data);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Lỗi khi cập nhật chỉ số điện nước",
      }
    );
  }
};

export const deleteElectricWaterService = async (id) => {
  try {
    const res = await axios.delete(`/electric-water/delete/${id}`);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi xóa chỉ số điện nước" }
    );
  }
};

export const getElectricWaterHistoryByRoomService = async (MaPT, MaDV) => {
  const res = await axios.get(`/electric-water/history`, {
    params: { MaPT, MaDV },
  });
  return res.data;
};

export const getElectricWaterByRoomAndMonthService = async (
  MaPT,
  MaDV,
  Thang,
  Nam
) => {
  const res = await axios.get(`/electric-water/history-by-month`, {
    params: { MaPT, MaDV, Thang, Nam },
  });
  return res.data;
};

export const checkPreviousMonthHasReadingService = async (
  MaPT,
  MaDV,
  Thang,
  Nam
) => {
  let prevMonth = Thang - 1;
  let prevYear = Nam;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }

  try {
    const res = await axios.get(`/electric-water/history-by-month`, {
      params: { MaPT, MaDV, Thang: prevMonth, Nam: prevYear },
    });
    const result = res.data;
    if (result.EC === 0 && result.DT && result.DT.ChiSoMoi !== null) {
      return true; // Có ChiSoMoi tháng trước
    }
    return false; // Không có hoặc ChiSoMoi là null
  } catch (error) {
    console.error("Error checking previous month reading:", error);
    return false;
  }
};

export const checkElectricWaterInvoiceStatusService = async (
  MaPT,
  Thang,
  Nam
) => {
  const res = await axios.get(`/electric-water/check-invoice-status`, {
    params: { MaPT, Thang, Nam },
  });
  return res.data;
};
