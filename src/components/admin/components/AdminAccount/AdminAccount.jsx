import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/admin/components/Pagination/Pagination";
import { getAllAccountService } from "@/services/accountServices";
import TableAccount from "./TableAccount/TableAccount";

const AdminAccount = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: accountData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccountService,
  });

  // Xử lý dữ liệu trả về từ API
  const filteredAccountData =
    accountData?.DT && accountData?.EC === 0
      ? accountData.DT.filter((account) =>
          account.TenTK.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];

  // Phân trang
  const totalItems = filteredAccountData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredAccountData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Danh sách tài khoản</h3>
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
            <div className="p-4 text-center">Không có dữ liệu tài khoản</div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminAccount;
