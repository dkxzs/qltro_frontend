import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllExpensesService,
  getExpensesByHouseAndRoomService,
  getExpensesByHouseService,
} from "@/services/expenseServices";
import { getAllHouseService } from "@/services/houseServices";
import { getRoomByIdService } from "@/services/roomServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import ModalAddExpense from "./ModalAddExpense/ModalAddExpense";
import TableExpense from "./TableExpense/TableExpense";

const AdminExpense = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  // Lấy danh sách nhà
  const { data: dataHouse } = useQuery({
    queryKey: ["houses"],
    queryFn: () => getAllHouseService(),
  });

  // Lấy danh sách phòng theo nhà
  const { data: dataRoom, refetch: refetchRooms } = useQuery({
    queryKey: ["rooms", selectedHouse],
    queryFn: () => getRoomByIdService(selectedHouse),
    enabled: !!selectedHouse,
  });

  // Lấy chi phí phát sinh
  const { data: expenseData, refetch } = useQuery({
    queryKey: ["expenses", selectedHouse, selectedRoom],
    queryFn: () => {
      if (selectedRoom && selectedRoom !== "all") {
        return getExpensesByHouseAndRoomService(selectedHouse, selectedRoom);
      } else if (selectedHouse && selectedHouse !== "all") {
        return getExpensesByHouseService(selectedHouse);
      }
      return getAllExpensesService();
    },
    enabled: true,
  });

  // Xử lý khi thay đổi nhà, reset phòng và gọi lại API lấy phòng
  useEffect(() => {
    if (selectedHouse) {
      setSelectedRoom("");
      refetchRooms();
    }
  }, [selectedHouse, refetchRooms]);

  const handleHouseChange = (value) => {
    setSelectedHouse(value);
    setSelectedRoom("");
    setCurrentPage(1);
  };

  const handleRoomChange = (value) => {
    setSelectedRoom(value);
    setCurrentPage(1);
  };

  const filteredExpenseData = expenseData?.DT || [];

  const totalPages = Math.ceil(
    (filteredExpenseData?.length || 0) / itemsPerPage
  );

  const paginatedData = filteredExpenseData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold mb-4">Quản lý chi phí phát sinh</h2>
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
                  <label className="w-28 text-sm">Nhà:</label>
                  <Select
                    value={selectedHouse}
                    onValueChange={handleHouseChange}
                  >
                    <SelectTrigger className="flex-1 rounded shadow-none cursor-pointer">
                      <SelectValue placeholder="Chọn nhà" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
                      {dataHouse?.DT?.map((house) => (
                        <SelectItem
                          key={house.MaNha}
                          value={house.MaNha.toString()}
                          className="cursor-pointer"
                        >
                          {house.TenNha}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-28 text-sm">Phòng:</label>
                  <Select
                    value={selectedRoom}
                    onValueChange={handleRoomChange}
                    disabled={!selectedHouse || selectedHouse === "all"}
                  >
                    <SelectTrigger className="flex-1 rounded cursor-pointer shadow-none">
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
                      <SelectItem value="all" className="cursor-pointer">
                        Tất cả
                      </SelectItem>
                      {dataRoom?.DT?.map((room) => (
                        <SelectItem
                          key={room.MaPT}
                          value={room.MaPT.toString()}
                          className="cursor-pointer"
                        >
                          {room.TenPhong}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách chi phí phát sinh</h2>
        <div className="flex items-center">
          <ModalAddExpense refetch={refetch} />
          <Button className="mr-2 flex items-center cursor-pointer bg-yellow-500 hover:bg-yellow-600 rounded">
            <Download className="h-4 w-4" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="min-h-[380px] rounded">
        <div className="rounded border overflow-hidden">
          <TableExpense expenseData={paginatedData} refetch={refetch} />
        </div>
      </div>

      {filteredExpenseData?.length > 0 && (
        <div className="mt-5">
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

export default AdminExpense;
