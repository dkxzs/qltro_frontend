import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useState, useEffect } from "react";
import ModalAddRoom from "./ModalAddRoom/ModalAddRoom";
import TableRoom from "./TableRoom/TableRoom";
import { getAllHouseService } from "@/services/houseServices";
import { useQuery } from "@tanstack/react-query";
import { getAllRoomService, getRoomByIdService } from "@/services/roomServices";
import Pagination from "../Pagination/Pagination";
import { exportToExcel, excelFormatters } from "@/utils/exportToExcel";
import { toast } from "react-toastify";

const AdminRoom = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [currentTab, setCurrentTab] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { data: houseData, isLoading: isLoadingHouse } = useQuery({
    queryKey: ["house"],
    queryFn: getAllHouseService,
  });

  const { data: allRoomData } = useQuery({
    queryKey: ["allRoom"],
    queryFn: getAllRoomService,
  });

  useEffect(() => {
    if (houseData?.DT && houseData.DT.length > 0) {
      setCurrentTab(houseData.DT[0].MaNha.toString());
    }
  }, [houseData]);

  const {
    data: roomData,
    isLoading: isLoadingRoom,
    refetch,
  } = useQuery({
    queryKey: ["room", currentTab],
    queryFn: () => getRoomByIdService(currentTab),
    enabled: !!currentTab,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab, searchText, statusFilter]);

  const filteredRoomData = roomData?.DT
    ? roomData.DT.filter((room) => {
        const matchesSearch = room.TenPhong.toLowerCase().includes(
          searchText.toLowerCase()
        );

        let matchesStatus = true;
        if (statusFilter === "rented") {
          matchesStatus = room.TrangThai === 1;
        } else if (statusFilter === "available") {
          matchesStatus = room.TrangThai === 0;
        }

        return matchesSearch && matchesStatus;
      })
    : [];

  const totalPages = Math.ceil((filteredRoomData?.length || 0) / itemsPerPage);

  const paginatedData = filteredRoomData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleExportExcel = async () => {
    if (!filteredRoomData || filteredRoomData.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      { key: "MaPT", label: "Mã phòng" },
      { key: "TenPhong", label: "Tên phòng" },
      { key: "TenNha", label: "Tên nhà" },
      { key: "TenLoaiPhong", label: "Loại phòng" },
      {
        key: "DonGia",
        label: "Đơn giá (VNĐ)",
        format: (value) => excelFormatters.currency(value),
      },
      { key: "DienTich", label: "Diện tích (m²)" },
      { key: "DiaChi", label: "Địa chỉ" },
      {
        key: "TrangThai",
        label: "Trạng thái",
        format: (value) => excelFormatters.status(value),
      },
      { key: "MoTa", label: "Mô tả" },
    ];

    const exportData = allRoomData?.DT.map((room) => ({
      MaPT: room.MaPT,
      TenPhong: room.TenPhong,
      TenNha: room.Nha.TenNha,
      TenLoaiPhong: room.LoaiPhong.TenLoaiPhong,
      DonGia: room.LoaiPhong.DonGia,
      DienTich: room.DienTich,
      DiaChi: room.Nha.DiaChi,
      TrangThai: room.TrangThai,
      MoTa: room.MoTa,
    }));

    try {
      const success = await exportToExcel(
        exportData,
        headers,
        `Danh_sach_phong_tro_${new Date().toISOString().split("T")[0]}`,
        "Danh sách phòng trọ",
        { title: "DANH SÁCH PHÒNG TRỌ" }
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
      <h2 className="text-xl font-semibold mb-4">Quản lý phòng trọ</h2>
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
                  <label className="w-27 text-sm">Tên phòng:</label>
                  <Input
                    placeholder="Nhập tên phòng"
                    className="flex-1 rounded outline-none shadow-none"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-25 text-sm">Trạng thái:</label>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    className="rounded outline-none focus-visible:ring-0 focus-visible:border-0 shadow-none"
                  >
                    <SelectTrigger className="flex-1 rounded cursor-pointer focus-visible:border-0 focus:none shadow-none">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
                      <SelectItem
                        className="hover:bg-transparent cursor-pointer"
                        value="all"
                      >
                        Tất cả
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-transparent cursor-pointer"
                        value="rented"
                      >
                        Đã cho thuê
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-transparent cursor-pointer"
                        value="available"
                      >
                        Còn trống
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-4">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <div className="flex justify-between items-center rounded">
            <TabsList className="rounded">
              {isLoadingHouse ? (
                <div className="px-4 py-2">Đang tải...</div>
              ) : houseData?.DT && houseData.DT.length > 0 ? (
                houseData?.DT.map((house) => (
                  <TabsTrigger
                    className="cursor-pointer rounded-xs"
                    key={house.MaNha}
                    value={house.MaNha.toString()}
                  >
                    {house.TenNha}
                  </TabsTrigger>
                ))
              ) : (
                <div className="px-4 py-2">Không có dữ liệu nhà</div>
              )}
            </TabsList>
            <div className="flex gap-2">
              <ModalAddRoom houseId={currentTab} refetch={refetch} />
              <Button
                variant="outline"
                className="bg-yellow-500 hover:bg-yellow-500 text-white rounded cursor-pointer hover:text-white"
                onClick={handleExportExcel}
              >
                <Download className="h-4 w-4" />
                Xuất dữ liệu
              </Button>
            </div>
          </div>

          {houseData?.DT && houseData.DT.length > 0 ? (
            houseData?.DT.map((house) => (
              <TabsContent
                key={house.MaNha}
                value={house.MaNha.toString()}
                className="mt-4"
              >
                <div className="min-h-[400px]">
                  {isLoadingRoom ? (
                    <div className="flex justify-center items-center h-64">
                      <p>Đang tải dữ liệu phòng...</p>
                    </div>
                  ) : (
                    <>
                      <div className="min-h-[380px] rounded">
                        <div className="rounded border overflow-hidden">
                          <TableRoom
                            roomData={paginatedData}
                            refetch={refetch}
                          />
                        </div>
                      </div>
                      {filteredRoomData.length > 0 ? (
                        <div className="mt-4 flex justify-center">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      ) : (
                        <div className="mt-4 text-center text-gray-500">
                          {/* Không có phòng nào phù hợp với điều kiện tìm kiếm */}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
            ))
          ) : (
            <div className="mt-4 rounded border p-8 text-center text-muted-foreground">
              Không có dữ liệu nhà. Vui lòng thêm nhà trước khi quản lý phòng.
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminRoom;
