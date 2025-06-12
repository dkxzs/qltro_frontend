import axios from "../utils/axiosCustomize.js";

export const sendInvoiceService = async ({
  invoiceId,
  fromEmail,
  encryptedPassword,
  bankInfo,
}) => {
  try {
    const res = await axios.post("/email/send-invoice", {
      invoiceId,
      fromEmail,
      encryptedPassword,
      bankInfo,
    });
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi gửi hóa đơn qua email" }
    );
  }
};

export const sendBulkInvoiceEmailService = async ({
  invoiceIds,
  fromEmail,
  encryptedPassword,
  bankInfo,
}) => {
  try {
    const res = await axios.post("/email/send-bulk-invoice", {
      invoiceIds,
      fromEmail,
      encryptedPassword,
      bankInfo,
    });
    return res.data;
  } catch (error) {
    return (
      error.response?.data || {
        EC: -1,
        EM: "Lỗi khi gửi hàng loạt hóa đơn qua email",
      }
    );
  }
};
