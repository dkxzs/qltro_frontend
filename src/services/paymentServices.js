import axios from "../utils/axiosCustomize.js";

export const addPaymentService = async (data) => {
  try {
    const res = await axios.post("/payment/create-payment", data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo thanh toán" };
  }
};

export const getPaymentByInvoiceIdService = async (id) => {
  const res = await axios.get(`/payment/get-payment/${id}`);
  return res.data;
};

export const getAllPaymentService = async () => {
  const res = await axios.get("/payment/get-all-payment");
  return res.data;
};
