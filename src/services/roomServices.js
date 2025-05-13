import axios from "../utils/axiosCustomize";

const getAllRoomService = async () => {
  const res = await axios.get(`/room/get-all-room`);
  return res.data;
};

const getRoomByIdService = async (houseId) => {
  const res = await axios.get(`/room/get-rooms-by-house/${houseId}`);
  return res.data;
};

const createRoomService = async (data) => {
  const dataRoom = new FormData();
  dataRoom.append("TenPhong", data.tenPhong);
  dataRoom.append("MaNha", parseInt(data.maNha));
  dataRoom.append("MaLP", parseInt(data.maLoaiPhong));
  dataRoom.append("DienTich", data.dienTich);
  dataRoom.append("MoTa", data.moTa);
  dataRoom.append("TrangThai", data.trangThai);
  dataRoom.append("SoLuongNguoiToiDa", data.soLuongNguoiToiDa);
  dataRoom.append("ChiSoDien", data.chiSoDien);
  dataRoom.append("ChiSoNuoc", data.chiSoNuoc);
  dataRoom.append("Anh", data.anh);
  const res = await axios.post("/room/create-room", dataRoom);
  return res.data;
};

const updateRoomService = async (id, data) => {
  const dataUpdate = new FormData();
  dataUpdate.append("TenPhong", data.tenPhong);
  dataUpdate.append("MaNha", parseInt(data.maNha));
  dataUpdate.append("MaLP", parseInt(data.maLoaiPhong));
  dataUpdate.append("DienTich", data.dienTich);
  dataUpdate.append("MoTa", data.moTa);
  dataUpdate.append("SoLuongNguoiToiDa", data.soLuongNguoiToiDa);
  dataUpdate.append("TrangThai", parseInt(data.trangThai));
  if (data.anh) dataUpdate.append("Anh", data.anh);
  const res = await axios.put(`/room/update-room/${id}`, dataUpdate);
  return res.data;
};

const deleteRoomService = async (id) => {
  const res = await axios.delete(`/room/delete-room/${id}`);
  return res.data;
};

const checkRoomHasRentService = async (id) => {
  const res = await axios.get(`/room/check-has-rent/${id}`);
  return res.data;
};

const updateRoomServicesService = async (id, services) => {
  const res = await axios.post(`/room/update-room-services/${id}`, {
    services,
  });
  return res.data;
};

const getRoomServicesService = async (roomId) => {
  const res = await axios.get(`/room/get-room-services/${roomId}`);
  return res.data;
};

export {
  getAllRoomService,
  getRoomByIdService,
  createRoomService,
  updateRoomService,
  deleteRoomService,
  checkRoomHasRentService,
  updateRoomServicesService,
  getRoomServicesService,
};
