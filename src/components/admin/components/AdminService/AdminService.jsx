import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllServiceService } from "@/services/serviceServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useState } from "react";
import ModalAddService from "./ModalAddService/ModalAddService";
import TableService from "./TableService/TableService";
import { exportToExcel, excelFormatters } from "@/utils/exportToExcel";
import { toast } from "react-toastify";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MdMiscellaneousServices } from "react-icons/md";
import Pagination from "../Pagination/Pagination";

const AdminService = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const { data: serviceData, refetch } = useQuery({
    queryKey: ["service"],
    queryFn: getAllServiceService,
  });

  const filteredData =
    serviceData?.DT?.filter((item) => {
      return item.TenDV.toLowerCase().includes(searchText.toLowerCase());
    }) || [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleExportExcel = async () => {
    if (!filteredData || filteredData.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      { key: "MaDV", label: "Mã dịch vụ" },
      { key: "TenDV", label: "Tên dịch vụ" },
      {
        key: "DonGia",
        label: "Đơn giá (VNĐ)",
        format: (value) => excelFormatters.currency(value),
      },
      { key: "LoaiDV", label: "Loại dịch vụ" },
      { key: "MoTa", label: "Mô tả" },
    ];

    try {
      const success = await exportToExcel(
        filteredData,
        headers,
        `Danh_sach_dich_vu_${new Date().toISOString().split("T")[0]}`,
        "Danh sách dịch vụ",
        { title: "DANH SÁCH DỊCH VỤ" }
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
          <MdMiscellaneousServices className="size-6" />
          <h1 className="text-2xl font-semibold ">Quản lý dịch vụ</h1>
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
                Quản lý dịch vụ
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
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-27 text-sm">Tên dịch vụ:</label>
                  <Input
                    placeholder="Nhập tên dịch vụ"
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">Danh sách dịch vụ</h1>
        </div>
        <div className="flex gap-2">
          <ModalAddService refetch={refetch} />
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer hover:text-white rounded"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4" /> Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className=" rounded overflow-x-auto min-h-[400px]">
        <TableService serviceData={paginatedData} refetch={refetch} />
      </div>

      {filteredData.length > 0 && (
        <div className="flex justify-end mt-1">
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

export default AdminService;
