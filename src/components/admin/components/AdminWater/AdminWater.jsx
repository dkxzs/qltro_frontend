import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllRoomsWithWaterService } from "@/services/electricWaterServices";
import { getAllHouseService } from "@/services/houseServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { MdWaterDrop } from "react-icons/md";
import Pagination from "../Pagination/Pagination";
import TableWater from "./TableWater/TableWater";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AdminWater = () => {
  const currentDate = new Date();
  // eslint-disable-next-line no-unused-vars
  const [month, setMonth] = useState(
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
      2,
      "0"
    )}`
  );
  const [selectedHouse, setSelectedHouse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [roomName, setRoomName] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [yearNum, monthNum] = month.split("-").map((num) => parseInt(num, 10));

  const { data: housesData } = useQuery({
    queryKey: ["houses"],
    queryFn: getAllHouseService,
  });

  const { data: roomsWithWaterData, isLoading } = useQuery({
    queryKey: ["rooms-with-water", monthNum, yearNum],
    queryFn: () => getAllRoomsWithWaterService(monthNum, yearNum),
    enabled: !!monthNum && !!yearNum,
  });

  const filteredData =
    roomsWithWaterData?.DT?.filter((item) => {
      const matchesHouse =
        selectedHouse === "all" ||
        item.PhongTro?.MaNha === parseInt(selectedHouse);

      const matchesRoomName =
        roomName === "" ||
        (item.PhongTro?.TenPhong &&
          item.PhongTro?.TenPhong.toLowerCase().includes(
            roomName.toLowerCase()
          ));

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "rented" && item.PhongTro?.TrangThai === 1) ||
        (selectedStatus === "available" && item.PhongTro?.TrangThai === 0);

      return matchesRoomName && matchesHouse && matchesStatus;
    }) || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [roomName, selectedHouse, selectedStatus]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayMonth = `${String(monthNum).padStart(2, "0")}/${yearNum}`;

  return (
    <div className="mx-auto p-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MdWaterDrop className="size-6" />
          <h1 className="text-2xl font-semibold">Chỉ số nước</h1>
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
                Quản lý nước
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
            <>
              <div className="p-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="block text-md font-medium mr-5 w-[6rem]">
                      Nhà
                    </label>
                    <Select
                      value={selectedHouse}
                      onValueChange={(value) => {
                        setSelectedHouse(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full rounded shadow-none cursor-pointer">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent className="rounded shadow-none cursor-pointer">
                        <SelectItem className="cursor-pointer" value="all">
                          Tất cả
                        </SelectItem>
                        {housesData?.DT?.map((house) => (
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
                    <label className="block text-md font-medium mr-5 w-[6rem]">
                      Phòng
                    </label>
                    <Input
                      type="text"
                      value={roomName || ""}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="rounded shadow-none"
                      placeholder="Nhập tên phòng"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="block text-md font-medium mr-5 w-[8rem]">
                      Trạng thái
                    </label>
                    <Select
                      value={selectedStatus}
                      onValueChange={(value) => {
                        setSelectedStatus(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full rounded shadow-none cursor-pointer">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent className="rounded shadow-none cursor-pointer">
                        <SelectItem className="cursor-pointer" value="all">
                          Tất cả
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="rented">
                          Đang thuê
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="available"
                        >
                          Còn trống
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="px-3 py-3">
                <p className="text-sm font-medium mb-1">Lưu ý:</p>
                <ul className="text-sm list-inside">
                  <li>
                    - Đối với lần đầu tiên sử dụng phần mềm bạn sẽ phải nhập chỉ số cũ và mới cho tháng sử dụng đầu tiên, các tháng tiếp theo phần mềm sẽ tự động lấy chỉ số mới tháng trước làm chỉ số cũ tháng sau.
                  </li>
                  <li>
                    - Khi cập nhật chỉ số mới cho tháng hiện tại, hệ thống sẽ tự động tạo bản ghi cho tháng tiếp theo với chỉ số cũ = chỉ số mới của tháng hiện tại.
                  </li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <label>
            <span className="text-md font-medium leading-none">
              Danh sách số nước tháng: {displayMonth}
            </span>
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <label
            htmlFor="warning"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-red-500"
          >
            Cảnh báo: chỉ số mới phải lớn hơn chỉ số cũ
          </label>
        </div>
      </div>

      <div className="rounded overflow-hidden min-h-[315px]">
        <div className="rounded border overflow-hidden">
          {isLoading ? (
            <p className="text-center text-md font-medium">Đang tải dữ liệu...</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-md font-medium py-3">
              Chưa có chỉ số nước cho tháng {displayMonth}
            </p>
          ) : (
            <TableWater
              waterData={currentItems}
              month={monthNum}
              year={yearNum}
            />
          )}
        </div>
      </div>

      {filteredData.length > 0 && (
        <div className="mt-3 flex justify-center">
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

export default AdminWater;