import axios from "../utils/axiosCustomize";

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
  const res = await axios.post("/electric-water/create", data);
  return res.data;
};

export const updateElectricWaterService = async (id, data) => {
  const res = await axios.put(`/electric-water/update/${id}`, data);
  return res.data;
};

export const deleteElectricWaterService = async (id) => {
  const res = await axios.delete(`/electric-water/delete/${id}`);
  return res.data;
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
