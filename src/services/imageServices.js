import axios from "../utils/axiosCustomize";

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

export const deleteImageService = async (fileId) => {
  try {
    const res = await axios.post("/image/delete-image", { fileId });
    if (res.status === 200 && res.data.EC === 0) {
      return res.data;
    }
    throw new Error(res.data.EM || "Lỗi khi xóa ảnh");
  } catch (error) {
    console.error("Lỗi deleteImageService:", error);
    throw error;
  }
};
