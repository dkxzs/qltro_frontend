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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllExpensesService,
  getExpenseByMonthYearService,
  getExpensesByHouseAndRoomService,
  getExpensesByHouseService,
} from "@/services/expenseServices";
import { getAllHouseService } from "@/services/houseServices";
import { getRoomByIdService } from "@/services/roomServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { GiExpense } from "react-icons/gi";
import Pagination from "../Pagination/Pagination";
import ModalAddExpense from "./ModalAddExpense/ModalAddExpense";
import TableExpense from "./TableExpense/TableExpense";
import { exportToExcel } from "@/utils/exportToExcel";
import { toast } from "react-toastify";

const AdminExpense = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  const { data: dataHouse } = useQuery({
    queryKey: ["houses"],
    queryFn: () => getAllHouseService(),
  });

  const { data: dataRoom, refetch: refetchRooms } = useQuery({
    queryKey: ["rooms", selectedHouse],
    queryFn: () => getRoomByIdService(selectedHouse),
    enabled: !!selectedHouse,
  });

  const queryFn = async () => {
    const [year, month] = selectedMonthYear ? selectedMonthYear.split("-") : [];

    if (selectedRoom && selectedRoom !== "all") {
      console.log("Fetching by house and room:", {
        selectedHouse,
        selectedRoom,
      });
      return getExpensesByHouseAndRoomService(selectedHouse, selectedRoom);
    } else if (selectedHouse && selectedHouse !== "all") {
      console.log("Fetching by house:", { selectedHouse });
      return getExpensesByHouseService(selectedHouse);
    } else if (month && year) {
      console.log("Fetching by month/year:", { month, year });
      return getExpenseByMonthYearService(month, year);
    }
    console.log("Fetching all expenses");
    return getAllExpensesService();
  };

  const { data: expenseData, refetch } = useQuery({
    queryKey: ["expenses", selectedHouse, selectedRoom, selectedMonthYear],
    queryFn,
    enabled: true,
  });

  // Xử lý khi thay đổi nhà, reset phòng và gọi lại API lấy phòng
  useEffect(() => {
    if (selectedHouse) {
      setSelectedRoom("");
      refetchRooms();
    }
  }, [selectedHouse, refetchRooms]);

  useEffect(() => {
    setCurrentPage(1);
    refetch();
  }, [selectedHouse, selectedRoom, selectedMonthYear, refetch]);

  // Reset nhà và phòng khi chọn tháng/năm
  useEffect(() => {
    if (selectedMonthYear) {
      setSelectedHouse("");
      setSelectedRoom("");
      refetch();
    }
  }, [selectedMonthYear]);

  const handleHouseChange = (value) => {
    setSelectedHouse(value);
    setSelectedRoom("");
    setSelectedMonthYear(""); // Reset tháng/năm khi chọn nhà
    setCurrentPage(1);
  };

  const handleRoomChange = (value) => {
    setSelectedRoom(value);
    setSelectedMonthYear(""); // Reset tháng/năm khi chọn phòng
    setCurrentPage(1);
  };

  const handleMonthYearChange = (value) => {
    setSelectedMonthYear(value);
    setSelectedHouse("");
    setSelectedRoom("");
    setCurrentPage(1);
  };

  const filteredExpenseData = expenseData?.DT || [];

  const totalPages = Math.ceil(
    (filteredExpenseData?.length || 0) / itemsPerPage
  );

  const paginatedData = filteredExpenseData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleExportExcel = async () => {
    if (!filteredExpenseData || filteredExpenseData.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      {
        key: "STT",
        label: "STT",
        format: (_, index) => index + 1,
      },
      {
        path: "PhongTro.TenPhong",
        label: "Phòng",
        format: (value) => value || "Không có phòng",
      },
      {
        key: "ThoiGian",
        label: "Thời gian",
        format: (_, row) => `${row.Thang}/${row.Nam}`,
      },
      {
        key: "NguoiChiTra",
        label: "Người chi trả",
        format: (value) => value || "N/A",
      },
      {
        key: "TongTien",
        label: "Tổng tiền (VNĐ)",
        format: (value) => formatCurrency(value),
      },
      {
        key: "MoTa",
        label: "Mô tả",
        format: (value) => value || "Không có",
      },
    ];

    try {
      const success = await exportToExcel(
        filteredExpenseData,
        headers,
        `Danh_sach_chi_phi_${new Date().toISOString().split("T")[0]}`,
        "Danh sách chi phí",
        { title: "DANH SÁCH CHI PHÍ PHÁT SINH" }
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
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1">
          <GiExpense className="size-4" />
          <h1 className="text-2xl font-semibold">Quản lý chi phí phát sinh</h1>
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
                Quản lý chi phí phát sinh
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
            <div className="p-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-30 text-sm">Tháng/Năm:</label>
                  <Input
                    type="month"
                    value={selectedMonthYear}
                    onChange={(e) => handleMonthYearChange(e.target.value)}
                    className="rounded shadow-none"
                    placeholder="Chọn tháng"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-18 text-sm">Nhà:</label>
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
                  <label className="w-19 text-sm">Phòng:</label>
                  <Select
                    value={selectedRoom}
                    onValueChange={handleRoomChange}
                    disabled={!selectedHouse || selectedHouse === ""}
                  >
                    <SelectTrigger className="flex-1 rounded cursor-pointer shadow-none">
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
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
        <div className="flex items-center gap-2">
          <ModalAddExpense refetch={refetch} />
          <Button
            className="mr-2 flex items-center cursor-pointer bg-yellow-500 hover:bg-yellow-600 rounded"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="min-h-[410px] rounded">
        <div className="rounded border overflow-hidden">
          <TableExpense expenseData={paginatedData} refetch={refetch} />
        </div>
      </div>

      {filteredExpenseData?.length > 0 && (
        <div className="mt-3">
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
