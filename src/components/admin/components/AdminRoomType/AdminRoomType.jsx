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
import { getAllRoomTypeService } from "@/services/roomTypeServices";
import { excelFormatters, exportToExcel } from "@/utils/exportToExcel";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { useState } from "react";
import { toast } from "react-toastify";
import ModalAddRoomType from "./ModalAddRoomType/ModalAddRoomType";
import TableRoomType from "./TableRoomType/TableRoomType";
import Pagination from "../Pagination/Pagination";

const AdminRoomType = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: roomTypeData, refetch } = useQuery({
    queryKey: ["roomType"],
    queryFn: getAllRoomTypeService,
  });

  const filteredData =
    roomTypeData?.DT?.filter((item) =>
      item.TenLoaiPhong.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

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
      { key: "MaLP", label: "Mã loại phòng" },
      { key: "TenLoaiPhong", label: "Tên loại phòng" },
      {
        key: "DonGia",
        label: "Đơn giá (VNĐ)",
        format: (value) => excelFormatters.currency(value),
      },
      { key: "MoTa", label: "Mô tả" },
    ];

    try {
      const success = await exportToExcel(
        filteredData,
        headers,
        `Danh_sach_loai_phong_${new Date().toISOString().split("T")[0]}`,
        "Danh sách loại phòng",
        { title: "DANH SÁCH LOẠI PHÒNG" }
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
    <div className="mx-auto p-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
          <VscTypeHierarchySub className="size-6" />
          <h1 className="text-2xl font-semibold">Quản lý loại phòng</h1>
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
                Quản lý loại phòng
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
                  <label className="w-27 text-sm">Tên loại phòng:</label>
                  <Input
                    placeholder="Nhập tên loại phòng"
                    className="flex-1 rounded outline-none shadow-none"
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium">Danh sách loại phòng</h2>
        </div>
        <div className="flex gap-2">
          <ModalAddRoomType refetch={refetch} />
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded cursor-pointer hover:text-white"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4" /> Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className=" rounded overflow-x-auto min-h-[400px]">
        <TableRoomType roomTypeData={paginatedData} refetch={refetch} />
      </div>

      {filteredData.length > 0 && (
        <div className="mt-4 flex justify-center">
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

export default AdminRoomType;
