import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllRoomsWithElectricService } from "@/services/electricWaterServices";
import { getAllHouseService } from "@/services/houseServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { MdElectricBolt } from "react-icons/md";
import Pagination from "../Pagination/Pagination";
import TableElectricity from "./TableElectricity/TableElectricity";

const AdminElectricity = () => {
  const currentDate = new Date();
  const [month] = useState(
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
      2,
      "0"
    )}`
  );
  const [selectedHouse, setSelectedHouse] = useState("all");
  const [roomName, setRoomName] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [yearNum, monthNum] = month.split("-").map((num) => parseInt(num, 10));

  const { data: housesData } = useQuery({
    queryKey: ["houses"],
    queryFn: getAllHouseService,
  });

  const { data: roomsWithElectricData } = useQuery({
    queryKey: ["rooms-with-electric", monthNum, yearNum],
    queryFn: () => getAllRoomsWithElectricService(monthNum, yearNum),
    enabled: !!monthNum && !!yearNum,
  });

  const filteredData =
    roomsWithElectricData?.DT?.filter((item) => {
      const matchesHouse =
        selectedHouse === "all" ||
        item.PhongTro?.MaNha === parseInt(selectedHouse);

      const matchesRoomName =
        roomName === "" ||
        (item.PhongTro?.TenPhong &&
          item.PhongTro?.TenPhong.toLowerCase().includes(
            roomName.toLowerCase()
          ));

      return matchesRoomName && matchesHouse;
    }) || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [roomName, selectedHouse]);

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
          <MdElectricBolt className="size-6 " />
          <h1 className="text-2xl font-semibold ">Chỉ số điện</h1>
        </div>
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
              <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="block text-md font-medium  mb-1 mr-5">
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
                    <label className="block text-md font-medium mb-1 mr-5">
                      Phòng
                    </label>
                    <Input
                      type="text"
                      value={roomName || ""}
                      onChange={(e) => setRoomName(e.target.value)}
                      className=" rounded shadow-none"
                      placeholder="Nhập tên phòng"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium mb-1">Lưu ý:</p>
                <ul className="text-sm list-inside">
                  <li>
                    - Đối với lần đầu tiên sử dụng phần mềm bạn sẽ phải nhập chỉ
                    số cũ và mới cho tháng sử dụng đầu tiên, các tháng tiếp theo
                    phần mềm sẽ tự động lấy chỉ số mới tháng trước làm chỉ số cũ
                    tháng sau.
                  </li>
                  <li>
                    - Khi cập nhật chỉ số mới cho tháng hiện tại, hệ thống sẽ tự
                    động tạo bản ghi cho tháng tiếp theo với chỉ số cũ = chỉ số
                    mới của tháng hiện tại.
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
              Danh sách số điện tháng: {displayMonth}
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

      <div className="rounded overflow-hidden min-h-[305px]">
        <TableElectricity
          electricData={currentItems}
          month={monthNum}
          year={yearNum}
        />
      </div>

      {filteredData.length > 0 && (
        <div className="mt-1 flex justify-center">
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

export default AdminElectricity;
