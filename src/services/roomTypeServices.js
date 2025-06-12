import axios from "../utils/axiosCustomize.js";

export const getAllRoomTypeService = async () => {
  const res = await axios.get("/room-type/get-all-room-type");
  return res.data;
};

export const createRoomTypeService = async (data) => {
  try {
    const res = await axios.post("/room-type/create-room-type", data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo loại phòng" };
  }
};

export const updateRoomTypeService = async (id, data) => {
  try {
    const res = await axios.put(`/room-type/update-room-type/${id}`, data);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi cập nhật loại phòng" }
    );
  }
};

export const deleteRoomTypeService = async (id) => {
  try {
    const res = await axios.delete(`/room-type/delete-room-type/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi xóa loại phòng" };
  }
};
