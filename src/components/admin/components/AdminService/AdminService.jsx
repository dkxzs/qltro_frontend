import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllServiceService } from "@/services/serviceServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useState } from "react";
import ModalAddService from "./ModalAddService/ModalAddService";
import TableService from "./TableService/TableService";

const AdminService = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");

  const { data: serviceData, refetch } = useQuery({
    queryKey: ["service"],
    queryFn: getAllServiceService,
  });

  const filteredData =
    serviceData?.DT?.filter((item) => {
      return item.TenDV.toLowerCase().includes(searchText.toLowerCase());
    }) || [];

  return (
    <div className="mx-auto p-2">
      <h2 className="text-xl font-semibold mb-4">Quản lý dịch vụ</h2>
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
          <Button className="bg-yellow-400 hover:bg-yellow-500 cursor-pointer hover:text-white rounded-sm">
            <Download className="h-4 w-4" /> Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="border rounded overflow-x-auto">
        <TableService serviceData={filteredData} refetch={refetch} />
      </div>
    </div>
  );
};

export default AdminService;
