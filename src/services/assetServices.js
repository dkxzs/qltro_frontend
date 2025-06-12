import axios from "../utils/axiosCustomize.js";

export const getAllAssetsService = async () => {
  const res = await axios.get("/asset/get-all-asset");
  return res.data;
};

export const createAssetService = async (data) => {
  try {
    const res = await axios.post("/asset/create-asset", data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo tài sản" };
  }
};

export const updateAssetService = async (id, data) => {
  try {
    const res = await axios.put(`/asset/update-asset/${id}`, data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi cập nhật tài sản" };
  }
};

export const deleteAssetService = async (id) => {
  try {
    const res = await axios.delete(`/asset/delete-asset/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi xóa tài sản" };
  }
};

export const checkAssetInUseService = async (id) => {
  const res = await axios.get(`/asset/check-in-use/${id}`);
  return res.data;
};
