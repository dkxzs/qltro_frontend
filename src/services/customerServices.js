import axios from "../utils/axiosCustomize";

const getAllCustomerService = async (onlyAvailable = false) => {
  const url = onlyAvailable
    ? "/customer/get-all-customer?available=true"
    : "/customer/get-all-customer";
  const res = await axios.get(url);
  return res.data;
};

const createCustomerService = async (data) => {
  try {
    const payload = {
      HoTen: data.name,
      CCCD: data.cardId,
      GioiTinh: data.gender,
      NgaySinh: data.birthday,
      DienThoaiChinh: data.phoneNumberMain,
      DienThoaiPhu: data.phoneNumberSub,
      SoXe: data.vehicleNumber,
      NgheNghiep: data.occupation,
      Email: data.email,
      DiaChi: data.address,
      NgayCap: data.dateOfIssue,
      NoiCap: data.placeOfIssue,
      image: data.image,
    };

    const res = await axios.post("/customer/create-customer", payload);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.EM || "Lỗi khi thêm khách hàng");
  }
};

const updateCustomerService = async (id, data) => {
  try {
    const res = await axios.put(`/customer/update-customer/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.EM || "Lỗi khi cập nhật khách hàng");
  }
};

const deleteCustomerService = async (id) => {
  const res = await axios.delete(`/customer/delete-customer/${id}`);
  return res.data;
};

const checkCustomerHasRentService = async (id) => {
  const res = await axios.get(`/customer/check-has-rent/${id}`);
  return res.data;
};

const historyCustomerRentService = async (id) => {
  const res = await axios.get(`/customer/history-rent/${id}`);
  return res.data;
};

const paymentHistoryService = async (id) => {
  const res = await axios.get(`/customer/payment-history/${id}`);
  return res.data;
};

const getCustomerByRoomIdService = async (id) => {
  const res = await axios.get(`/customer/get-customer-by-roomId/${id}`);
  return res.data;
};

export {
  checkCustomerHasRentService,
  createCustomerService,
  deleteCustomerService,
  getAllCustomerService,
  getCustomerByRoomIdService,
  historyCustomerRentService,
  paymentHistoryService,
  updateCustomerService,
};
