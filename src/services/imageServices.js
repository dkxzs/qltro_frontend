import axios from "../utils/axiosCustomize";

// Gọi API để tạo ảnh từ HTML
export const generateImageService = async (htmlContent) => {
  const res = await axios.post(
    "/image/generate-image",
    { htmlContent },
    { responseType: "blob" }
  );
  return res.data;
};

export const generatePDFService = async (htmlContent, invoiceId) => {
  const res = await axios.post(
    "/image/generate-pdf",
    { htmlContent, invoiceId },
    { responseType: "blob" }
  );
  return res.data;
};
