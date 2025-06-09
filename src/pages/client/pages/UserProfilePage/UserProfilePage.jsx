import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getCustomerByAccountService } from "@/services/customerServices";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { Mail, Phone } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useSelector } from "react-redux";

const UserProfilePage = () => {
  const token = useSelector((state) => state.account.account.accessToken);
  const decoded = jwtDecode(token);

  const { data: customerData } = useQuery({
    queryKey: ["customerInfo"],
    queryFn: async () => getCustomerByAccountService(decoded?.MaTK),
    enabled: !!decoded?.MaTK,
  });

  console.log("customerData", customerData);

  return (
    <div className="container mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Thông tin cá nhân
      </h1>
      <Card className="shadow-none rounded">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-6 border-b pb-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border-2 border-blue-100">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {customerData?.DT.HoTen
                    ? customerData?.DT.HoTen.split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "A"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">
                {customerData?.DT.HoTen || "Chưa cập nhật"}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="size-4" />
                  <span>
                    {customerData?.DT.DienThoaiChinh || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4" />
                  <span>{customerData?.DT.Email || "Chưa cập nhật"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold mb-4">
              Thông tin hợp đồng thuê
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-gray-500 mb-1">Nhà</p>
                <p>
                  {customerData?.DT.ThuePhong[0].PhongTro?.Nha?.TenNha ||
                    "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Phòng</p>
                <p>
                  {customerData?.DT.ThuePhong[0].PhongTro?.TenPhong ||
                    "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>
          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div>
                <p className="text-gray-500 mb-1">Họ Tên</p>
                <p>{customerData?.DT.HoTen || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày Sinh</p>
                <p>
                  {customerData?.DT.NgaySinh
                    ? format(new Date(customerData?.DT.NgaySinh), "dd/MM/yyyy")
                    : "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Giới Tính</p>
                <p>{customerData?.DT.GioiTinh || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Số CMND/CCCD</p>
                <p>{customerData?.DT.CCCD || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày Cấp</p>
                <p>
                  {customerData?.DT.NgayCap
                    ? format(new Date(customerData?.DT.NgayCap), "dd/MM/yyyy")
                    : "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Nơi Cấp</p>
                <p>{customerData?.DT.NoiCap || "Chưa cập nhật"}</p>
              </div>
            </div>
          </div>
          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold mb-4">
              Thông tin liên hệ & khác
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div>
                <p className="text-gray-500 mb-1">Số Điện Thoại</p>
                <p>{customerData?.DT.DienThoaiChinh || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Số Điện Thoại Phụ</p>
                <p>{customerData?.DT.DienThoaiPhu || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p>{customerData?.DT.Email || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Nghề Nghiệp</p>
                <p>{customerData?.DT.NgheNghiep || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Địa chỉ thường trú</p>
                <p>{customerData?.DT.DiaChi || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Thông Tin Xe</p>
                <p>{customerData?.DT.SoXe || "Chưa cập nhật"}</p>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-2">Hình ảnh CCCD</h3>
            <div>
              <Zoom>
                <img
                  src={customerData?.DT.HinhAnh.Url}
                  alt="Hình ảnh CCCD"
                  className="w-64 h-48 object-contain"
                />
              </Zoom>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
