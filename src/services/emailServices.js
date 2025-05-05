import axios from "../utils/axiosCustomize";

// Gửi email hóa đơn
export const sendInvoiceService = async ({
  invoiceId,
  htmlContent,
  fromEmail,
  encryptedPassword,
}) => {
  const res = await axios.post("/email/send-invoice", {
    invoiceId,
    htmlContent,
    fromEmail,
    encryptedPassword,
  });
  return res.data;
};
