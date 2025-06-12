import axios from "../utils/axiosCustomize.js";

const getAllStaffService = async () => {
  const response = await axios.get("/staff/get-all-staffs");
  return response.data;
};

const createStaffService = async (data) => {
  try {
    const response = await axios.post("/staff/create-staff", data);
    return response.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo nhân viên" };
  }
};

const updateStaffService = async (id, data) => {
  try {
    const response = await axios.put(`/staff/update-staff/${id}`, data);
    return response.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi cập nhật nhân viên" };
  }
};

const deleteStaffService = async (id) => {
  try {
    const response = await axios.delete(`/staff/delete-staff/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi xóa nhân viên" };
  }
};

const checkStaffHasAssignmentService = async (id) => {
  const response = await axios.get(`/staff/check-assignment/${id}`);
  return response.data;
};

export {
  getAllStaffService,
  createStaffService,
  updateStaffService,
  deleteStaffService,
  checkStaffHasAssignmentService,
};
