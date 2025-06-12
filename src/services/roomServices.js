import axios from "../utils/axiosCustomize.js";

const getAllRoomService = async () => {
  const res = await axios.get(`/room/get-all-room`);
  return res.data;
};

const getRoomByIdService = async (houseId) => {
  const res = await axios.get(`/room/get-rooms-by-house/${houseId}`);
  return res.data;
};

const createRoomService = async (data) => {
  try {
    const payload = {
      tenPhong: data.tenPhong,
      maNha: parseInt(data.maNha),
      maLoaiPhong: parseInt(data.maLoaiPhong),
      dienTich: data.dienTich,
      moTa: data.moTa,
      trangThai: data.trangThai,
      soLuongNguoiToiDa: data.soLuongNguoiToiDa,
      tieuDe: data.tieuDe,
      chiSoDien: data.chiSoDien,
      chiSoNuoc: data.chiSoNuoc,
      images: data.images || [],
    };
    const res = await axios.post("/room/create-room", payload);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo phòng" };
  }
};

const updateRoomService = async (data) => {
  try {
    const payload = {
      TenPhong: data.tenPhong,
      MaNha: parseInt(data.maNha),
      MaLP: parseInt(data.maLoaiPhong),
      DienTich: data.dienTich,
      MoTa: data.moTa,
      SoLuongNguoiToiDa: data.soLuongNguoiToiDa || 0,
      TieuDe: data.tieuDe,
      TrangThai: parseInt(data.trangThai),
      images: data.images || [],
      imagesToDelete: data.imagesToDelete || [],
    };
    const res = await axios.put(`/room/update-room/${data.maPT}`, payload);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi cập nhật phòng" };
  }
};

const deleteRoomService = async (id) => {
  try {
    const res = await axios.delete(`/room/delete-room/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi xóa phòng" };
  }
};

const checkRoomHasRentService = async (id) => {
  const res = await axios.get(`/room/check-has-rent/${id}`);
  return res.data;
};

const updateRoomServicesService = async (id, services) => {
  try {
    const res = await axios.post(`/room/update-room-services/${id}`, {
      services,
    });
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi cập nhật dịch vụ phòng" }
    );
  }
};

const getRoomServicesService = async (roomId) => {
  const res = await axios.get(`/room/get-room-services/${roomId}`);
  return res.data;
};

const getRoomByRoomIdService = async (roomId) => {
  const res = await axios.get(`/room/get-room-by-roomId/${roomId}`);
  return res.data;
};

const getAvailableRoomsByHouseService = async (houseId) => {
  const res = await axios.get(`/room/get-room-available/${houseId}`);
  return res.data;
};

const getAllAvailableRoomsService = async () => {
  const res = await axios.get(`/room/get-all-available-room`);
  return res.data;
};

const getRoomByAccountIdService = async (MaTK) => {
  const res = await axios.get(`/room/get-room-by-accountId/${MaTK}`);
  return res.data;
};

const getRoomsByHouseService = async (houseId) => {
  const res = await axios.get(`/room/get-rooms-by-house/${houseId}`);
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
  getRoomByRoomIdService,
  getAvailableRoomsByHouseService,
  getAllAvailableRoomsService,
  getRoomByAccountIdService,
  getRoomsByHouseService,
};
