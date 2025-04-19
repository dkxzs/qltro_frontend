import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllCustomerService } from "@/services/customerServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import ModalAddUser from "./ModalAddCustomer/ModalAddCustomer";
import TableUser from "./TableUser/TableUser";

const AdminUser = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { data: userData, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => getAllCustomerService(false),
  });

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

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold mb-4">Quản lý khách trọ</h2>
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
          <div className="flex items-center">
            <ModalAddUser refetch={refetch} />
            <Button className="mr-2 flex items-center cursor-pointer bg-yellow-500 hover:bg-yellow-600 rounded">
              <Download className="h-4 w-4" />
              Xuất dữ liệu
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-[380px] rounded">
        <div className="rounded border overflow-hidden">
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

export default AdminUser;
