import axios from "../utils/axiosCustomize.js";

const getAllServiceService = async () => {
  const res = await axios.get("/service/get-all-service");
  return res.data;
};

const createServiceService = async (data) => {
  try {
    const res = await axios.post("/service/create-service", data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo dịch vụ" };
  }
};

const updateServiceService = async (id, data) => {
  try {
    const res = await axios.put(`/service/update-service/${id}`, data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi cập nhật dịch vụ" };
  }
};

const deleteServiceService = async (id) => {
  try {
    const res = await axios.delete(`/service/delete-service/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi xóa dịch vụ" };
  }
};

const checkServiceInUseService = async (id) => {
  const res = await axios.get(`/service/check-in-use/${id}`);
  return res.data;
};

export {
  getAllServiceService,
  createServiceService,
  updateServiceService,
  deleteServiceService,
  checkServiceInUseService,
};
