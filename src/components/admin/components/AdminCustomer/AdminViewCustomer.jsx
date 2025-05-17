import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminViewCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (location.state?.user) {
      setUserData(location.state.user);
    } else {
      toast.error("Không tìm thấy thông tin khách hàng!");
      navigate(-1);
    }
  }, [location.state, navigate]);

  console.log("userData: ", userData);

  if (!userData) {
    return (
      <div className="container mx-auto py-3 px-2 flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-3 px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết khách thuê</h1>
        <Button
          variant="outline"
          className="text-purple-600 cursor-pointer rounded shadow-none"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Button>
      </div>
      <Card className="shadow-none rounded">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-6 border-b pb-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border-2 border-purple-100">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                  {userData?.HoTen
                    ? userData?.HoTen.split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "BON"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">
                {userData?.HoTen || "Chưa cập nhật"}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">ID Khách:</span>
                  <span>{userData?.MaKH || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Trạng thái:</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                    {userData.TrangThai === 1 ? "Đang thuê" : "Trả phòng"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="size-4" />
                  <span>{userData?.DienThoaiChinh || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4" />
                  <span>{userData?.Email || "Chưa cập nhật"}</span>
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
                <p>{userData?.HoTen || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày Sinh</p>
                <p>
                  {userData?.NgaySinh
                    ? format(new Date(userData.NgaySinh), "dd/MM/yyyy")
                    : "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Giới Tính</p>
                <p>{userData?.GioiTinh || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Số CMND/CCCD</p>
                <p>{userData?.CCCD || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày Cấp</p>
                <p>
                  {userData?.NgayCap
                    ? format(new Date(userData.NgayCap), "dd/MM/yyyy")
                    : "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Nơi Cấp</p>
                <p>{userData?.NoiCap || "Chưa cập nhật"}</p>
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
                <p>{userData?.DienThoaiChinh || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p>{userData?.Email || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Nghề Nghiệp</p>
                <p>
                  {userData?.NgheNghiep === "null"
                    ? "Chưa cập nhật"
                    : userData?.NgheNghiep}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Địa chỉ thường trú</p>
                <p>{userData?.DiaChi || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Thông Tin Xe</p>
                <p>{userData?.SoXe || "Chưa cập nhật"}</p>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-2">Hình ảnh đính kèm</h3>
            <div>
              <Zoom>
                <img
                  src={userData?.Anh}
                  alt="Hình ảnh đính kèm"
                  className="w-64 h-48 rounded object-contain "
                />
              </Zoom>
            </div>
          </div>
          {/* Thông Tin Xe */}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminViewCustomer;
