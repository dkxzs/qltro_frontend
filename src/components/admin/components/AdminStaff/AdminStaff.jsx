import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllStaffService } from "@/services/staffServices";
import { exportToExcel } from "@/utils/exportToExcel";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download, User } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ModalAddStaff from "./ModalAddStaff/ModalAddStaff";
import TableStaff from "./TableStaff/TableStaff";

const AdminStaff = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");

  const {
    data: employeeData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["employee"],
    queryFn: () => getAllStaffService(),
  });

  const filteredEmployeeData = employeeData?.DT
    ? employeeData.DT.filter((employee) =>
        employee.HoTen.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const handleExportExcel = () => {
    if (!filteredEmployeeData || filteredEmployeeData.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      { key: "MaNV", label: "Mã Nhân Viên" },
      { key: "HoTen", label: "Họ Tên" },
      { key: "NgaySinh", label: "Ngày Sinh" },
      { key: "GioiTinh", label: "Giới Tính" },
      { key: "DienThoai", label: "Điện Thoại" },
      { key: "Email", label: "Email" },
      { key: "DiaChi", label: "Địa Chỉ" },
      { key: "ChucVu", label: "Chức Vụ" },
      { key: "MaTK", label: "Mã Tài Khoản" },
    ];

    const success = exportToExcel(
      filteredEmployeeData,
      headers,
      `Danh_sach_nhan_vien_${new Date().toISOString().split("T")[0]}`,
      "Danh sách nhân viên",
      { title: "DANH SÁCH NHÂN VIÊN" }
    );

    if (success) {
      toast.success("Xuất dữ liệu thành công");
    } else {
      toast.error("Xuất dữ liệu thất bại");
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
          <User className="size-6" />
          <h1 className="text-2xl font-semibold">Quản lý nhân viên</h1>
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
                Quản lý nhân viên
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
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-20 text-sm">Họ tên:</label>
                  <Input
                    placeholder="Nhập họ tên"
                    className="flex-1 rounded outline-none shadow-none"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Danh sách nhân viên</h3>
        <div className="flex gap-2">
          <ModalAddStaff refetch={refetch} />
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded cursor-pointer hover:text-white"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="rounded border overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Đang tải dữ liệu...</div>
        ) : (
          <TableStaff employeeData={filteredEmployeeData} refetch={refetch} />
        )}
      </div>
    </div>
  );
};

export default AdminStaff;