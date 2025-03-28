import axios from "../utils/axiosCustomize";

const createCustomerService = async (data) => {
  const formData = new FormData();
  formData.append("HoTen", data.name);
  formData.append("CCCD", data.cardId);
  formData.append("GioiTinh", data.gender);
  formData.append("NgaySinh", data.birthday);
  formData.append("DienThoai", data.phoneNumber);
  formData.append("Email", data.email);
  formData.append("DiaChi", data.address);
  formData.append("Anh", data.avatar);
  const res = await axios.post("/customer/create-customer", formData);
  return res.data;
};

export { createCustomerService };
