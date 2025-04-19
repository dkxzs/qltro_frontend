import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllHouseService } from "@/services/houseServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useState } from "react";
import ModalAddHouse from "./ModalAddHouse/ModalAddHouse";
import TableHouse from "./TableHouse/TableHouse";
import { exportToExcel } from "@/utils/exportToExcel";
import { toast } from "react-toastify";

const AdminHouse = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");

  const {
    data: houseData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["house"],
    queryFn: getAllHouseService,
  });

  const filteredHouseData = houseData?.DT
    ? houseData.DT.filter((house) =>
        house.TenNha.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const handleExportExcel = () => {
    if (!filteredHouseData || filteredHouseData.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      { key: "MaNha", label: "Mã Nhà" },
      { key: "TenNha", label: "Tên nhà" },
      { key: "DiaChi", label: "Địa chỉ" },
      { key: "MoTa", label: "Mô tả" },
    ];

    const success = exportToExcel(
      filteredHouseData,
      headers,
      `Danh_sach_nha_${new Date().toISOString().split("T")[0]}`,
      "Danh sách nhà",
      { title: "DANH SÁCH NHÀ TRỌ" }
    );

    if (success) {
      toast.success("Xuất dữ liệu thành công");
    } else {
      toast.error("Xuất dữ liệu thất bại");
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold mb-4">Quản lý nhà trọ</h2>
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
                  <label className="w-20 text-sm">Tên nhà:</label>
                  <Input
                    placeholder="Nhập tên nhà"
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
        <h3 className="text-xl font-medium">Danh sách nhà trọ</h3>
        <div className="flex gap-2">
          <ModalAddHouse refetch={refetch} />
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded cursor-pointer hover:text-white"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="rounded border overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Đang tải dữ liệu...</div>
        ) : (
          <TableHouse houseData={filteredHouseData} refetch={refetch} />
        )}
      </div>
    </div>
  );
};

export default AdminHouse;
