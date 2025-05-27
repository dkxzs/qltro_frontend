import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllCustomerService } from "@/services/customerServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import Pagination from "../Pagination/Pagination";
import ModalAddUser from "./ModalAddCustomer/ModalAddCustomer";
import TableUser from "./TableCustomer/TableCustomer";
import { exportToExcel } from "@/utils/exportToExcel";
import { toast } from "react-toastify";

const AdminCustomer = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { data: userData, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => getAllCustomerService(false),
  });

  console.log("userData", userData);

  const filteredUserData = userData?.DT.filter((user) =>
    user.HoTen.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUserData?.length / itemsPerPage);

  const paginatedData = filteredUserData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleExportExcel = () => {
    if (!filteredUserData || filteredUserData.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      { key: "MaKH", label: "Mã khách hàng" },
      { key: "HoTen", label: "Họ và tên" },
      { key: "DienThoai", label: "Số điện thoại" },
      { key: "CCCD", label: "Căn cước công dân" },
      { key: "Email", label: "Email" },
      { key: "DiaChi", label: "Địa chỉ" },
      { key: "NgaySinh", label: "Ngày sinh" },
      { key: "GioiTinh", label: "Giới tính" },
      {
        key: "TrangThai",
        label: "Trạng thái",
        format: (value) => (value ? "Đang thuê" : "Đã trả"),
      },
    ];

    const success = exportToExcel(
      filteredUserData,
      headers,
      `Danh_sach_khach_tro_${new Date().toISOString().split("T")[0]}`,
      "Danh sách khách trọ",
      { title: "DANH SÁCH KHÁCH TRỌ" }
    );

    if (success) {
      toast.success("Xuất dữ liệu thành công");
    } else {
      toast.error(
        "Xuất dữ liệu thất bại. Vui lòng kiểm tra console để biết thêm chi tiết."
      );
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FaUserFriends className="size-6" />
          <h1 className="text-2xl font-semibold">Quản lý khách trọ</h1>
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
                Quản lý khách trọ
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
                  <label className="w-27 text-sm">Tên khách trọ:</label>
                  <Input
                    placeholder="Nhập tên khách trọ"
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

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Danh sách khách trọ</h2>
          <div className="flex items-center gap-2">
            <ModalAddUser refetch={refetch} />
            <Button
              className="mr-2 flex items-center cursor-pointer bg-yellow-500 hover:bg-yellow-600 rounded"
              onClick={handleExportExcel}
            >
              <Download className="h-4 w-4" />
              Xuất dữ liệu
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-[380px] rounded w-full">
        <div className="rounded border">
          <TableUser userData={paginatedData} refetch={refetch} />
        </div>
      </div>

      {filteredUserData?.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminCustomer;
