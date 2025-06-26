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
import { getAllAccountService } from "@/services/accountServices";
import { exportToExcel } from "@/utils/exportToExcel";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download, User } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Pagination from "@/components/admin/components/Pagination/Pagination";
import TableAccount from "./TableAccount/TableAccount";

const AdminAccount = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const {
    data: accountData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccountService,
  });

  const filteredAccountData =
    accountData?.DT && accountData?.EC === 0
      ? accountData.DT.filter((account) =>
          account.TenTK.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredAccountData.length / itemsPerPage);

  // Lấy dữ liệu cho trang hiện tại
  const paginatedData = filteredAccountData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Xử lý xuất dữ liệu
  const handleExportExcel = async () => {
    if (!filteredAccountData || filteredAccountData.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      { key: "MaTK", label: "Mã tài khoản" },
      { key: "TenTK", label: "Tên tài khoản" },
      { key: "Email", label: "Email" },
      {
        key: "TrangThai",
        label: "Trạng thái",
        format: (value) => (value === 1 ? "Hoạt động" : "Ngừng hoạt động"),
      },
      { key: "VaiTro", label: "Vai trò" },
    ];

    try {
      const success = await exportToExcel(
        filteredAccountData,
        headers,
        `Danh_sach_tai_khoan_${new Date().toISOString().split("T")[0]}`,
        "Danh sách tài khoản",
        { title: "DANH SÁCH TÀI KHOẢN" }
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
          <User className="size-6" />
          <h1 className="text-2xl font-semibold">Quản lý tài khoản</h1>
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
                Quản lý tài khoản
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
                  <label className="w-30 text-sm">Tên tài khoản:</label>
                  <Input
                    placeholder="Nhập tên tài khoản"
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

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Danh sách tài khoản</h3>
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded cursor-pointer hover:text-white"
          onClick={handleExportExcel}
        >
          <Download className="h-4 w-4 mr-2" />
          Xuất dữ liệu
        </Button>
      </div>

      <div className="min-h-[400px]">
        <div className="rounded border overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              Lỗi khi tải dữ liệu: {error.message}
            </div>
          ) : paginatedData.length > 0 ? (
            <TableAccount accountData={paginatedData} refetch={refetch} />
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không có tài khoản nào khớp với bộ lọc.
            </div>
          )}
        </div>
      </div>

      {filteredAccountData.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminAccount;
