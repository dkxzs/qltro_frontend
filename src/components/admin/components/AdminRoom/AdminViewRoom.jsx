import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCustomerByRoomIdService } from "@/services/customerServices";
import { getMemberByRoomIdService } from "@/services/memberServices";
import { getRoomByRoomIdService } from "@/services/roomServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { getRoomStatusText } from "@/utils/roomStatusUtils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { MdOutlineBedroomParent } from "react-icons/md";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminViewRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (location.state?.roomId) {
      setRoomId(location.state.roomId);
    } else if (location.state?.roomData?.MaPT) {
      setRoomId(location.state.roomData.MaPT);
    } else {
      toast.error("Không tìm thấy thông tin phòng trọ!");
      navigate(-1);
    }
  }, [location.state, navigate]);

  const {
    data: roomResponse,
    isLoading: isRoomLoading,
    isError: isRoomError,
    error: roomError,
  } = useQuery({
    queryKey: ["room-detail", roomId],
    queryFn: () => getRoomByRoomIdService(roomId),
    enabled: !!roomId,
  });

  const {
    data: customerResponse,
    isLoading: isCustomerLoading,
    isError: isCustomerError,
    error: customerError,
  } = useQuery({
    queryKey: ["customer-detail", roomId],
    queryFn: () => getCustomerByRoomIdService(roomId),
    enabled: !!roomId && roomResponse?.DT?.TrangThai === 1,
  });

  const {
    data: membersResponse,
    isLoading: isMembersLoading,
    isError: isMembersError,
    error: membersError,
  } = useQuery({
    queryKey: ["members", roomId],
    queryFn: () => getMemberByRoomIdService(roomId),
    enabled: !!roomId && roomResponse?.DT?.TrangThai === 1,
  });

  const roomData = roomResponse?.DT;
  const customerData = customerResponse?.DT;
  const thanhVienData = membersResponse?.DT || [];

  if (isRoomLoading || isCustomerLoading || isMembersLoading) {
    return (
      <div className="container mx-auto py-3 px-2">Đang tải thông tin...</div>
    );
  }

  if (isRoomError) {
    return (
      <div className="container mx-auto py-3 px-2">
        <div className="text-red-500">
          Có lỗi xảy ra: {roomError?.message || "Không thể tải thông tin phòng"}
        </div>
        <Button
          variant="outline"
          className="mt-4 text-purple-600 cursor-pointer rounded shadow-none"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> Quay Lại Danh Sách
        </Button>
      </div>
    );
  }

  if (isCustomerError) {
    toast.error(customerError?.message || "Không thể tải thông tin khách hàng");
  }

  if (isMembersError) {
    toast.error(membersError?.message || "Không thể tải danh sách thành viên");
  }

  return (
    <div className="container mx-auto py-3 px-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết phòng trọ</h1>
        <Button
          variant="outline"
          className="text-purple-600 cursor-pointer rounded shadow-none"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> Quay Lại Danh Sách
        </Button>
      </div>

      <Card className="shadow-md rounded">
        <CardContent className="px-5">
          <div className="flex flex-col md:flex-row gap-6 border-b pb-6">
            <div className="flex-shrink-0">
              <MdOutlineBedroomParent className="size-16" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Phòng: {roomData?.TenPhong}</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Mã phòng:</span>
                  <span>{roomData?.MaPT}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Trạng thái:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      roomData?.TrangThai === 0
                        ? "bg-green-100 text-green-700"
                        : roomData?.TrangThai === 1
                        ? "bg-blue-100 text-blue-700"
                        : roomData?.TrangThai === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {getRoomStatusText(roomData?.TrangThai)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Thông Tin Phòng</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div>
                <p className="text-gray-500 mb-1">Tên Phòng</p>
                <p>{roomData?.TenPhong}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Loại Phòng</p>
                <p>{roomData?.LoaiPhong?.TenLoaiPhong || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Giá Thuê</p>
                <p>{formatCurrency(roomData?.LoaiPhong?.DonGia || 0)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Diện Tích</p>
                <p>{roomData?.DienTich} m²</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Số Người Tối Đa</p>
                <p>{roomData?.SoLuongNguoiToiDa} người</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Trạng Thái</p>
                <p
                  className={`${
                    roomData?.TrangThai === 0
                      ? "text-green-600"
                      : roomData?.TrangThai === 1
                      ? "text-blue-600"
                      : roomData?.TrangThai === 2
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {getRoomStatusText(roomData?.TrangThai)}
                </p>
              </div>
            </div>
          </div>

          <div className="py-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Thông Tin Nhà</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-gray-500 mb-1">Tên Nhà</p>
                <p>{roomData?.Nha?.TenNha || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Địa Chỉ</p>
                <p>{roomData?.Nha?.DiaChi || "Chưa cập nhật"}</p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Mô Tả</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {roomData?.MoTa || "Không có mô tả nào cho phòng này."}
              </p>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Hình Ảnh</h3>
            <div className="flex flex-wrap gap-4">
              {roomData?.HinhAnh?.map((image, index) => (
                <Zoom>
                  <img
                    key={index}
                    src={image.Url}
                    alt={`Hình ảnh ${index + 1}`}
                    className="w-64 h-48 rounded object-contain border border-gray-200 mb-6"
                  />
                </Zoom>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {roomData?.TrangThai === 1 && (
        <>
          <Card className="shadow-md rounded my-3">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row gap-6 border-b pb-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24 border-2 border-purple-100">
                    <AvatarImage src={"/placeholder.svg"} alt="Avatar" />
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                      {customerData?.HoTen
                        ? customerData.HoTen.split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">
                    {customerData?.HoTen || "Không có khách hàng"}
                  </h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">ID Khách:</span>
                      <span>{customerData?.MaKH || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Trạng thái:</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                        {roomData?.TrangThai === 1 ? "Đang thuê" : "Trả phòng"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="size-4" />
                      <span>
                        {customerData?.DienThoaiChinh || "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="size-4" />
                      <span>{customerData?.Email || "Chưa cập nhật"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-6 border-b">
                <h3 className="text-lg font-semibold mb-4">
                  Thông Tin Cá Nhân
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-gray-500 mb-1">Họ Tên</p>
                    <p>{customerData?.HoTen || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Ngày Sinh</p>
                    <p>
                      {customerData?.NgaySinh
                        ? format(new Date(customerData.NgaySinh), "dd/MM/yyyy")
                        : "Chưa cập nhật"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Giới Tính</p>
                    <p>{customerData?.GioiTinh || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Số CMND/CCCD</p>
                    <p>{customerData?.CCCD || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Ngày Cấp</p>
                    <p>
                      {customerData?.NgayCap
                        ? format(new Date(customerData.NgayCap), "dd/MM/yyyy")
                        : "Chưa cập nhật"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Nơi Cấp</p>
                    <p>{customerData?.NoiCap || "Chưa cập nhật"}</p>
                  </div>
                </div>
              </div>
              <div className="py-6 border-b">
                <h3 className="text-lg font-semibold mb-4">
                  Thông Tin Liên Hệ & Khác
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-gray-500 mb-1">Số Điện Thoại</p>
                    <p>{customerData?.DienThoaiChinh || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Số Điện Thoại Phụ</p>
                    <p>{customerData?.DienThoaiPhu || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Email</p>
                    <p>{customerData?.Email || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Nghề Nghiệp</p>
                    <p>{customerData?.NgheNghiep || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Địa chỉ thường trú</p>
                    <p>{customerData?.DiaChi || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Thông Tin Xe</p>
                    <p>{customerData?.SoXe || "Chưa cập nhật"}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Hình ảnh đính kèm
                </h3>
                <div className="w-40 h-40">
                  <Zoom>
                    <img
                      src={customerData?.HinhAnh?.Url || "/placeholder.svg"}
                      alt={`Image`}
                      className="w-full h-auto"
                    />
                  </Zoom>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded shadow-md my-3">
            <CardContent className="px-4">
              <h3 className="text-lg font-semibold mb-4">
                Thông Tin Thành Viên
              </h3>
              <div className="overflow-x-auto rounded">
                <Table className="border-2 rounded">
                  <TableHeader>
                    <TableRow className="bg-sky-50">
                      <TableHead className="text-left text-gray-600">
                        Mã TV
                      </TableHead>
                      <TableHead className="text-left text-gray-600">
                        Tên
                      </TableHead>
                      <TableHead className="text-left text-gray-600">
                        CCCD
                      </TableHead>
                      <TableHead className="text-left text-gray-600">
                        Ngày Sinh
                      </TableHead>
                      <TableHead className="text-left text-gray-600">
                        Điện Thoại
                      </TableHead>
                      <TableHead className="text-left text-gray-600">
                        Địa Chỉ
                      </TableHead>
                      <TableHead className="text-left text-gray-600">
                        Trạng Thái
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {thanhVienData.length > 0 ? (
                      thanhVienData.map((thanhVien) => (
                        <TableRow
                          key={thanhVien.MaTV}
                          className="hover:bg-gray-50"
                        >
                          <TableCell>{thanhVien.MaTV}</TableCell>
                          <TableCell>{thanhVien.TenTV}</TableCell>
                          <TableCell>{thanhVien.CCCD}</TableCell>
                          <TableCell>
                            {thanhVien.NgaySinh
                              ? format(
                                  new Date(thanhVien.NgaySinh),
                                  "dd/MM/yyyy"
                                )
                              : "Chưa cập nhật"}
                          </TableCell>
                          <TableCell>
                            {thanhVien.DienThoai || "Chưa cập nhật"}
                          </TableCell>
                          <TableCell>
                            {thanhVien.DiaChi || "Chưa cập nhật"}
                          </TableCell>
                          <TableCell>
                            {thanhVien.TrangThai ? "Đang thuê" : "Dừng thuê"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-gray-500 py-4"
                        >
                          Không có thành viên nào trong phòng này.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminViewRoom;
