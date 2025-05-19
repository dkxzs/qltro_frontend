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
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import Pagination from "../Pagination/Pagination";
import ModalAddDeposit from "./ModalAddDeposit/ModalAddDeposit";
import TableDeposit from "./TableDeposit/TableDeposit";
import { exportToExcel } from "@/utils/exportToExcel";
import { toast } from "react-toastify";
import { getAllDepositService } from "@/services/depositServices";
import { useQuery } from "@tanstack/react-query";

const AdminDeposit = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { data: depositData, refetch } = useQuery({
    queryKey: ["deposit"],
    queryFn: getAllDepositService,
  });

  const filteredDepositData = depositData?.DT.filter((deposit) =>
    deposit.TenKH.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDepositData?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleExportExcel = () => {
    if (!filteredDepositData || filteredDepositData.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      { key: "MaDC", label: "Mã đặt cọc" },
      { key: "MaPT", label: "Mã phòng trọ" },
      { key: "TenKH", label: "Tên khách hàng" },
      { key: "SoDienThoai", label: "Số điện thoại" },
      {
        key: "SoTien",
        label: "Số tiền",
        format: (value) => `${value.toLocaleString()} VND`,
      },
      { key: "NgayDatCoc", label: "Ngày đặt cọc" },
      { key: "GhiChu", label: "Ghi chú" },
      { key: "TrangThai", label: "Trạng thái" },
    ];

    const success = exportToExcel(
      filteredDepositData,
      headers,
      `Danh_sach_dat_coc_${new Date().toISOString().split("T")[0]}`,
      "Danh sách đặt cọc",
      { title: "DANH SÁCH ĐẶT CỌC" }
    );

    if (success) {
      toast.success("Xuất dữ liệu thành công");
    } else {
      toast.error(
        "Xuất dữ liệu thất bại. Vui lòng kiểm tra console để biết thêm chi tiết."
      );
    }
  };

  console.log(depositData);

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="size-6" />
          <h1 className="text-2xl font-semibold">Quản lý đặt cọc</h1>
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
                Quản lý đặt cọc
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
                  <label className="w-27 text-sm">Tên khách hàng:</label>
                  <Input
                    placeholder="Nhập tên khách hàng"
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
          <h2 className="text-xl font-semibold">Danh sách đặt cọc</h2>
          <div className="flex items-center gap-2">
            <ModalAddDeposit refetch={refetch} />
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
          <TableDeposit depositData={filteredDepositData} refetch={refetch} />
        </div>
      </div>

      {filteredDepositData?.length > 0 && (
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

export default AdminDeposit;
