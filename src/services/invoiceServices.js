import axios from "../utils/axiosCustomize";

export const createInvoiceService = async (data) => {
  const res = await axios.post("/invoice/create-invoice", data);
  return res.data;
};

export const getAllInvoiceService = async () => {
  const res = await axios.get("/invoice/get-all-invoice");
  return res.data;
};

export const getInvoiceByIdService = async (id) => {
  const res = await axios.get(`/invoice/get-invoice/${id}`);
  return res.data;
};
