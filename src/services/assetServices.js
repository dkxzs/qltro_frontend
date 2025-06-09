import axios from "../utils/axiosCustomize";

const getAllAssetsService = async () => {
  const res = await axios.get("/asset/get-all-asset");
  return res.data;
};

const createAssetService = async (data) => {
  const res = await axios.post("/asset/create-asset", data);
  return res.data;
};

const updateAssetService = async (id, data) => {
  const res = await axios.put(`/asset/update-asset/${id}`, data);
  return res.data;
};

const deleteAssetService = async (id) => {
  const res = await axios.delete(`/asset/delete-asset/${id}`);
  return res.data;
};

const checkAssetInUseService = async (id) => {
  const res = await axios.get(`/asset/check-in-use/${id}`);
  return res.data;
};

export {
  getAllAssetsService,
  createAssetService,
  updateAssetService,
  deleteAssetService,
  checkAssetInUseService,
};
