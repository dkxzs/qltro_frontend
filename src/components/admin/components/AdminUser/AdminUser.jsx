import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Download, Plus } from "lucide-react";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import TableUser from "./TableUser/TableUser";
import ModalAddUser from "./ModalAddCustomer/ModalAddCustomer";
import { useQuery } from "@tanstack/react-query";
import { getAllCustomerService } from "@/services/customerServices";

const AdminUser = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const { data: userData, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: getAllCustomerService,
  });

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold mb-4">Quản lý khách trọ</h2>
      <Card className="mb-4 rounded py-2">
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
                  <label className="w-27 text-sm">Tên khách trọ:</label>
                  <Input
                    placeholder="Nhập tên khách trọ"
                    className="flex-1 rounded outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Danh sách khách trọ</h3>
          <div className="flex items-center">
            <ModalAddUser refetch={refetch} />
            <Button className="mr-2 flex items-center cursor-pointer bg-yellow-500 hover:bg-yellow-600 rounded">
              <Download className="h-5 w-5" />
              Xuất file
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-[380px]">
        <div className="rounded border overflow-hidden">
          <TableUser userData={userData} refetch={refetch} />
        </div>
      </div>
      <div className="my-2">
        <Pagination />
      </div>
    </div>
  );
};

export default AdminUser;
