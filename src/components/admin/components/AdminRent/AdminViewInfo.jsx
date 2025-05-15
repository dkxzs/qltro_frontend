import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, Badge, FileText, Home, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminViewInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rentData, setRentData] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "[Ngày]";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  useEffect(() => {
    if (location.state?.rentData) {
      setRentData(location.state.rentData);
    } else {
      toast.error("Không tìm thấy thông tin khách hàng!");
      navigate(-1);
    }
  }, [location.state, navigate]);

  // Nếu rentData chưa được tải, hiển thị thông báo hoặc loading
  if (!rentData) {
    return <div className="container mx-auto py-3 px-2">Đang tải...</div>;
  }

  console.log(rentData);

  return (
    <div className="container mx-auto py-3 px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết khách thuê</h1>
        <Button
          variant="outline"
          className="text-purple-600 cursor-pointer rounded shadow-none"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> Quay Lại Danh Sách
        </Button>
      </div>

      <Card className="shadow-none rounded">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 border-b pb-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border-2 border-purple-100">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                  {rentData.KhachHang?.HoTen
                    ? rentData.KhachHang.HoTen.split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "BON"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">
                {rentData.KhachHang?.HoTen || "Chưa cập nhật"}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">ID Khách:</span>
                  <span>{rentData.KhachHang?.MaKH || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Trạng thái:</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                    {rentData.TrangThai === 1 ? "Đang thuê" : "Trả phòng"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </span>
                  <span>
                    {rentData.KhachHang?.DienThoaiChinh || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline mr-1 -z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <span>{rentData.KhachHang?.Email || "Chưa cập nhật"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thông Tin Cá Nhân */}
          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Thông Tin Cá Nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div>
                <p className="text-gray-500 mb-1">Họ Tên</p>
                <p>{rentData.KhachHang?.HoTen || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày Sinh</p>
                <p>
                  {rentData.KhachHang?.NgaySinh
                    ? format(
                        new Date(rentData.KhachHang.NgaySinh),
                        "dd/MM/yyyy"
                      )
                    : "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Giới Tính</p>
                <p>{rentData.KhachHang?.GioiTinh || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Số CMND/CCCD</p>
                <p>{rentData.KhachHang?.CCCD || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày Cấp</p>
                <p>
                  {rentData.KhachHang?.NgayCap
                    ? format(new Date(rentData.KhachHang.NgayCap), "dd/MM/yyyy")
                    : "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Nơi Cấp</p>
                <p>{rentData.KhachHang?.NoiCap || "Chưa cập nhật"}</p>
              </div>
            </div>
          </div>

          {/* Thông Tin Liên Hệ & Khác */}
          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold mb-4">
              Thông Tin Liên Hệ & Khác
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div>
                <p className="text-gray-500 mb-1">Số Điện Thoại</p>
                <p>{rentData.KhachHang?.DienThoaiChinh || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p>{rentData.KhachHang?.Email || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Nghề Nghiệp</p>
                <p>{rentData.KhachHang?.NgheNghiep || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Địa chỉ thường trú</p>
                <p>{rentData.KhachHang?.DiaChi || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Thông Tin Xe</p>
                <p>{rentData.KhachHang?.SoXe || "Chưa cập nhật"}</p>
              </div>
            </div>
          </div>

          {/* Thông Tin Phòng */}
          <div className="py-6">
            <h3 className="text-lg font-semibold mb-4">Hình ảnh đính kèm</h3>
            <div>
              <img
                src={rentData?.KhachHang?.Anh}
                alt="Hình ảnh đính kèm"
                className="w-30 h-30 rounded"
              />
            </div>
          </div>

          {/* Thông Tin Xe */}
        </CardContent>
      </Card>

      <Card className="shadow-none mt-6 rounded">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">Thông Tin Thuê Hiện Tại</h2>

          {/* Hợp Đồng */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Hợp Đồng</h3>
              <span className="text-sm text-gray-500">(HD15)</span>
              <a href="#" className="text-sm text-blue-600 ml-1">
                (Xem chi tiết)
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div>
                <p className="text-gray-500 mb-1">Trạng thái HD</p>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 hover:bg-green-100 border-0"
                >
                  Đang Hiệu Lực
                </Badge>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày bắt đầu</p>
                <p>{formatDate(rentData.NgayBatDau)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày kết thúc</p>
                <p>{formatDate(rentData.NgayKetThuc)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Giá thuê (lúc ký)</p>
                <p className="font-medium">
                  {formatCurrency(rentData.DonGia)} đ/tháng
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Tiền cọc</p>
                <p>{formatCurrency(rentData.DatCoc)} đ</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày vào ở</p>
                <p>{formatDate(rentData.NgayBatDau)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Đại diện HD?</p>
                <p className="text-green-600">Có</p>
              </div>
            </div>
          </div>

          {/* Phòng Thuê */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Phòng Thuê</h3>
              <a href="#" className="text-sm text-blue-600 ml-1">
                (Xem chi tiết)
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div>
                <p className="text-gray-500 mb-1">Tên phòng</p>
                <p className="font-medium">{rentData.PhongTro.TenPhong}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Diện tích</p>
                <p>{rentData.PhongTro.DienTich} m²</p>
              </div>
            </div>
          </div>

          {/* Khu Nhà */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Khu Nhà</h3>
              <a href="#" className="text-sm text-blue-600 ml-1">
                (Xem chi tiết)
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-gray-500 mb-1">Tên khu nhà</p>
                <p className="font-medium">{rentData.PhongTro.Nha.TenNha}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Địa chỉ</p>
                <p>{rentData.PhongTro.Nha.DiaChi}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminViewInfo;
