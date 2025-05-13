import axios from "../utils/axiosCustomize";

const getAllCustomerService = async (onlyAvailable = false) => {
  const url = onlyAvailable
    ? "/customer/get-all-customer?available=true"
    : "/customer/get-all-customer";
  const res = await axios.get(url);
  return res.data;
};

const createCustomerService = async (data) => {
  const formData = new FormData();
  formData.append("HoTen", data.name);
  formData.append("CCCD", data.cardId);
  formData.append("GioiTinh", data.gender);
  formData.append("NgaySinh", data.birthday);
  formData.append("DienThoaiChinh", data.phoneNumberMain);
  formData.append("Email", data.email);
  formData.append("DiaChi", data.address);
  formData.append("Anh", data.avatar);
  formData.append("NgayCap", data.dateOfIssue);
  formData.append("NoiCap", data.placeOfIssue);
  formData.append("DienThoaiPhu", data.phoneNumberSub);
  formData.append("SoXe", data.vehicleNumber);
  formData.append("NgheNghiep", data.occupation);
  const res = await axios.post("/customer/create-customer", formData);
  return res.data;
};

const updateCustomerService = async (id, data) => {
  const formData = new FormData();
  formData.append("HoTen", data.name);
  formData.append("CCCD", data.cardId);
  formData.append("GioiTinh", data.gender);
  formData.append("NgaySinh", data.birthday);
  formData.append("DienThoaiChinh", data.phoneNumberMain);
  formData.append("DienThoaiPhu", data.phoneNumberSub);
  formData.append("SoXe", data.vehicleNumber);
  formData.append("NgheNghiep", data.occupation);
  formData.append("Email", data.email);
  formData.append("DiaChi", data.address);
  formData.append("NgayCap", data.dateOfIssue);
  formData.append("NoiCap", data.placeOfIssue);
  if (data.avatar instanceof File) {
    formData.append("Anh", data.avatar);
  }
  const res = await axios.put(`/customer/update-customer/${id}`, formData);
  return res.data;
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

export {
  createCustomerService,
  getAllCustomerService,
  updateCustomerService,
  deleteCustomerService,
  checkCustomerHasRentService,
  historyCustomerRentService,
  paymentHistoryService,
};
