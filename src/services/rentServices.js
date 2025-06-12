import axios from "../utils/axiosCustomize.js";

export const getAllRentService = async () => {
  const res = await axios.get("/rent/get-all-rent");
  return res.data;
};

export const createRentService = async (data) => {
  try {
    const payload = {
      maKT: data.maKT,
      newCustomer: data.newCustomer
        ? {
            HoTen: data.newCustomer.HoTen,
            CCCD: data.newCustomer.CCCD,
            GioiTinh: data.newCustomer.GioiTinh,
            NgaySinh: data.newCustomer.NgaySinh,
            DienThoaiChinh: data.newCustomer.DienThoaiChinh,
            DienThoaiPhu: data.newCustomer.DienThoaiPhu,
            Email: data.newCustomer.Email,
            DiaChi: data.newCustomer.DiaChi,
            NgayCap: data.newCustomer.NgayCap,
            NoiCap: data.newCustomer.NoiCap,
            SoXe: data.newCustomer.SoXe,
            NgheNghiep: data.newCustomer.NgheNghiep,
            Anh: data.newCustomer.Anh,
          }
        : null,
      maPT: data.maPT,
      ngayBatDau: data.ngayBatDau,
      ngayKetThuc: data.ngayKetThuc || "",
      ghiChu: data.ghiChu || "",
      donGia: data.donGia,
      datCoc: data.datCoc,
      dichVu: data.dichVu,
    };
    const res = await axios.post("/rent/create-rent", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo hợp đồng thuê" };
  }
};

export const createRentFromDepositService = async (data) => {
  try {
    const payload = {
      newCustomer: data.newCustomer
        ? {
            HoTen: data.newCustomer.HoTen,
            CCCD: data.newCustomer.CCCD,
            GioiTinh: data.newCustomer.GioiTinh,
            NgaySinh: data.newCustomer.NgaySinh,
            DienThoaiChinh: data.newCustomer.DienThoaiChinh,
            DienThoaiPhu: data.newCustomer.DienThoaiPhu,
            Email: data.newCustomer.Email,
            DiaChi: data.newCustomer.DiaChi,
            NgayCap: data.newCustomer.NgayCap,
            NoiCap: data.newCustomer.NoiCap,
            SoXe: data.newCustomer.SoXe,
            NgheNghiep: data.newCustomer.NgheNghiep,
            Anh: data.newCustomer.Anh,
          }
        : null,
      maPT: data.maPT,
      ngayBatDau: data.ngayBatDau,
      ngayKetThuc: data.ngayKetThuc || "",
      ghiChu: data.ghiChu || "",
      donGia: data.donGia,
      datCoc: data.datCoc,
      dichVu: data.dichVu,
      deposit: data.deposit,
      datCocUpdateData: {
        TenKH: data.deposit.TenKH,
        SoDienThoai: data.deposit.SoDienThoai,
        SoTien: data.datCoc,
        GhiChu: data.deposit.GhiChu || "",
      },
    };
    const res = await axios.post("/rent/create-rent-from-deposit", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi tạo hợp đồng từ đặt cọc" }
    );
  }
};

export const updateRentService = async (id, data) => {
  try {
    const res = await axios.put(`/rent/update-rent/${id}`, data);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi cập nhật hợp đồng thuê" }
    );
  }
};

export const deleteRentService = async (id) => {
  try {
    const res = await axios.delete(`/rent/delete-rent/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi xóa hợp đồng thuê" };
  }
};
