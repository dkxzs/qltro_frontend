import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllBuildingService } from "@/services/buildingServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useState } from "react";
import ModalAddBuilding from "./ModalAddBuilding/ModalAddBuilding";
import TableBuilding from "./TableBuilding/TableBuilding";

const AdminBuilding = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");

  const { data: buildingData, refetch } = useQuery({
    queryKey: ["building"],
    queryFn: getAllBuildingService,
  });

  const filteredData =
    buildingData?.DT?.filter((item) => {
      return (
        item.TenNha.toLowerCase().includes(searchText.toLowerCase()) ||
        item.DiaChi.toLowerCase().includes(searchText.toLowerCase())
      );
    }) || [];

  return (
    <div className="mx-auto p-2">
      <h2 className="text-xl font-semibold mb-4">Quản lý nhà</h2>
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
                  <label className="w-27 text-sm">Tên nhà/Địa chỉ:</label>
                  <Input
                    placeholder="Nhập tên nhà hoặc địa chỉ"
                    className="flex-1 rounded outline-none"
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
          <h1 className="text-lg font-semibold">Danh sách nhà</h1>
        </div>
        <div className="flex gap-2">
          <ModalAddBuilding refetch={refetch} />
          <Button className="bg-yellow-400 hover:bg-yellow-500 cursor-pointer hover:text-white rounded-sm">
            <Download className="h-4 w-4" /> Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="border rounded overflow-x-auto">
        <TableBuilding buildingData={filteredData} refetch={refetch} />
      </div>
    </div>
  );
};

export default AdminBuilding;
