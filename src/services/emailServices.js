import axios from "../utils/axiosCustomize";

export const sendInvoiceService = async ({
  invoiceId,
  fromEmail,
  encryptedPassword,
  bankInfo,
}) => {
  const res = await axios.post("/email/send-invoice", {
    invoiceId,
    fromEmail,
    encryptedPassword,
    bankInfo,
  });
  return res.data;
};

export const sendBulkInvoiceEmailService = async ({
  invoiceIds,
  fromEmail,
  encryptedPassword,
  bankInfo,
}) => {
  const res = await axios.post("/email/send-bulk-invoice", {
    invoiceIds,
    fromEmail,
    encryptedPassword,
    bankInfo,
  });
  return res.data;
};
