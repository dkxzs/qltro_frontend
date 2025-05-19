import axios from "../utils/axiosCustomize";

export const getAllRentService = async () => {
  const res = await axios.get("/rent/get-all-rent");
  return res.data;
};

export const createRentService = async (data) => {
  const formData = new FormData();

  formData.append("maKH", data.maKH);
  if (data.newCustomer) {
    formData.append("HoTen", data.newCustomer.HoTen);
    formData.append("CCCD", data.newCustomer.CCCD);
    formData.append("GioiTinh", data.newCustomer.GioiTinh);
    formData.append("NgaySinh", data.newCustomer.NgaySinh);
    formData.append("DienThoaiChinh", data.newCustomer.DienThoaiChinh);
    formData.append("Email", data.newCustomer.Email);
    formData.append("DiaChi", data.newCustomer.DiaChi);
    formData.append("NgayCap", data.newCustomer.NgayCap);
    formData.append("NoiCap", data.newCustomer.NoiCap);
    formData.append("NgheNghiep", data.newCustomer.NgheNghiep);
    formData.append("SoXe", data.newCustomer.SoXe);
    formData.append("DienThoaiPhu", data.newCustomer.DienThoaiPhu);
    if (data.newCustomer.Anh) {
      formData.append("Anh", data.newCustomer.Anh);
    }
  }
  formData.append("maPT", data.maPT);
  formData.append("ngayBatDau", data.ngayBatDau);
  formData.append("ngayKetThuc", data.ngayKetThuc || "");
  formData.append("ghiChu", data.ghiChu || "");
  formData.append("donGia", data.donGia);
  formData.append("datCoc", data.datCoc);
  if (data.dichVu && Array.isArray(data.dichVu)) {
    data.dichVu.forEach((service, index) => {
      formData.append(`dichVu[${index}][madv]`, service.madv);
      formData.append(`dichVu[${index}][soluong]`, service.soluong);
    });
  }

  const res = await axios.post("/rent/create-rent", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createRentFromDepositService = async (data, deposit) => {
  const formData = new FormData();

  // Thêm dữ liệu khách hàng mới
  formData.append("HoTen", data.newCustomer.HoTen);
  formData.append("CCCD", data.newCustomer.CCCD);
  formData.append("GioiTinh", data.newCustomer.GioiTinh);
  formData.append("NgaySinh", data.newCustomer.NgaySinh);
  formData.append("DienThoaiChinh", data.newCustomer.DienThoaiChinh);
  formData.append("Email", data.newCustomer.Email);
  formData.append("DiaChi", data.newCustomer.DiaChi);
  formData.append("NgayCap", data.newCustomer.NgayCap);
  formData.append("NoiCap", data.newCustomer.NoiCap);
  formData.append("NgheNghiep", data.newCustomer.NgheNghiep);
  formData.append("SoXe", data.newCustomer.SoXe);
  formData.append("DienThoaiPhu", data.newCustomer.DienThoaiPhu);
  if (data.newCustomer.Anh) {
    formData.append("avatar", data.newCustomer.Anh);
  }

  // Thêm dữ liệu hợp đồng
  formData.append("maPT", data.maPT);
  formData.append("ngayBatDau", data.ngayBatDau);
  formData.append("ngayKetThuc", data.ngayKetThuc || "");
  formData.append("ghiChu", data.ghiChu || "");
  formData.append("donGia", data.donGia);
  formData.append("datCoc", data.datCoc);

  // Thêm danh sách dịch vụ
  if (data.dichVu && Array.isArray(data.dichVu)) {
    data.dichVu.forEach((service, index) => {
      formData.append(`dichVu[${index}][madv]`, service.madv);
      formData.append(`dichVu[${index}][soluong]`, service.soluong);
    });
  }

  // Thêm thông tin deposit
  formData.append("deposit", JSON.stringify(deposit));

  const res = await axios.post("/rent/create-rent-from-deposit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateRentService = async (id, data) => {
  const res = await axios.put(`/rent/update-rent/${id}`, data);
  return res.data;
};

export const deleteRentService = async (id) => {
  const res = await axios.delete(`/rent/delete-rent/${id}`);
  return res.data;
};
