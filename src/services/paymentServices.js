import axios from "../utils/axiosCustomize";

export const addPaymentService = async (data) => {
  const res = await axios.post("/payment/create-payment", data);
  return res.data;
};

export const getPaymentByInvoiceIdService = async (id) => {
  const res = await axios.get(`/payment/get-payment/${id}`);
  return res.data;
};

export const getInvoiceByIdService = async (invoiceId) => {
  const res = await axios.get(`/invoices/${invoiceId}`);
  return res.data;
};
