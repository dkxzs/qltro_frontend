import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllHouseService } from "@/services/houseServices";
import { getAllRentService } from "@/services/rentServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { FaFileContract } from "react-icons/fa";
import TableRent from "./TableRent/TableRent";
import ModalAddRent from "./ModalAddRent/ModalAddRent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { exportToExcel } from "@/utils/exportToExcel"; // Thêm import
import { toast } from "react-toastify"; // Thêm import để hiển thị thông báo

const AdminRent = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState("all");
  const [roomName, setRoomName] = useState("");
  const [filteredRentData, setFilteredRentData] = useState([]);

  const { data: housesData } = useQuery({
    queryKey: ["houses"],
    queryFn: getAllHouseService,
  });

  const { data: rentData } = useQuery({
    queryKey: ["rent-list"],
    queryFn: getAllRentService,
  });

  console.log("rentData", rentData);

  // Filter rent data based on selected house and room name
  useEffect(() => {
    if (rentData?.DT) {
      const filtered = rentData.DT.filter((rent) => {
        const matchesHouse =
          selectedHouse === "all" ||
          rent.PhongTro?.Nha?.MaNha === parseInt(selectedHouse);

        const matchesRoomName =
          roomName === "" ||
          (rent.PhongTro?.TenPhong &&
            rent.PhongTro.TenPhong.toLowerCase().includes(
              roomName.toLowerCase()
            ));

        return matchesRoomName && matchesHouse;
      });

      setFilteredRentData(filtered);
    }
  }, [rentData, selectedHouse, roomName]);

  // Hàm xử lý xuất Excel
  const handleExportExcel = async () => {
    if (!filteredRentData || filteredRentData.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      { key: "MaTP", label: "Mã hợp đồng" },
      {
        path: "KhachHang.HoTen",
        label: "Tên khách hàng",
        format: (value) => value || "N/A",
      },
      {
        path: "PhongTro.Nha.TenNha",
        label: "Tên nhà",
        format: (value) => value || "N/A",
      },
      {
        path: "PhongTro.TenPhong",
        label: "Tên phòng",
        format: (value) => value || "N/A",
      },
      {
        key: "NgayBatDau",
        label: "Ngày bắt đầu",
        format: (value) =>
          value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      },
      {
        key: "NgayKetThuc",
        label: "Ngày kết thúc",
        format: (value) =>
          value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      },
      {
        key: "DonGia",
        label: "Đơn giá (VNĐ)",
        format: (value) => (value ? value.toLocaleString("vi-VN") : "0"),
      },
      {
        key: "DatCoc",
        label: "Đặt cọc (VNĐ)",
        format: (value) => (value ? value.toLocaleString("vi-VN") : "0"),
      },
    ];

    try {
      const success = await exportToExcel(
        filteredRentData,
        headers,
        `Danh_sach_hop_dong_${new Date().toISOString().split("T")[0]}`,
        "Danh sách hợp đồng",
        { title: "DANH SÁCH HỢP ĐỒNG" }
      );

      if (success) {
        toast.success("Xuất dữ liệu thành công");
      } else {
        toast.error("Xuất dữ liệu thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      toast.error("Xuất dữ liệu thất bại");
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <FaFileContract className="size-5" />
          <h1 className="text-2xl font-semibold ">Quản lý hợp đồng</h1>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-md font-semibold">
                Tổng quan
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-md font-semibold">
                Quản lý hợp đồng
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="mb-4 rounded py-2 shadow-none">
        <CardContent className="p-0">
          <div
            className="flex items-center cursor-pointer border-b"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          >
            {isFilterExpanded ? (
              <ChevronDown className="h-5 w-5 mr-2 mb-2 ml-3" />
            ) : (
              <ChevronUp className="h-5 w-5 mr-2 mb-2 ml-3" />
            )}
            <span className="font-medium mb-2">Bộ lọc tìm kiếm</span>
          </div>

          {isFilterExpanded && (
            <>
              <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="block text-md font-medium mb-1 mr-5">
                      Nhà
                    </label>
                    <Select
                      value={selectedHouse}
                      onValueChange={(value) => setSelectedHouse(value)}
                    >
                      <SelectTrigger className="w-full rounded shadow-none cursor-pointer">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent className="rounded shadow-none cursor-pointer">
                        <SelectItem className="cursor-pointer" value="all">
                          Tất cả
                        </SelectItem>
                        {housesData?.DT?.map((house) => (
                          <SelectItem
                            key={house.MaNha}
                            value={house.MaNha.toString()}
                            className="cursor-pointer"
                          >
                            {house.TenNha}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="block text-md font-medium mb-1 mr-5">
                      Phòng
                    </label>
                    <Input
                      type="text"
                      className="rounded shadow-none"
                      placeholder="Nhập tên phòng"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Danh sách hợp đồng</h3>
        <div className="flex gap-2">
          <ModalAddRent showText={true} />
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded cursor-pointer hover:text-white"
            onClick={handleExportExcel} // Gắn hàm xuất Excel vào nút
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="rounded overflow-hidden">
        <TableRent filteredData={filteredRentData} />
      </div>
    </div>
  );
};

export default AdminRent;
