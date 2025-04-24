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
import { getAllHouseService } from "@/services/houseServices";
import { getAllRentService } from "@/services/rentServices";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { FaFileContract } from "react-icons/fa";
import TableRent from "./TableRent/TableRent";
import ModalAddRent from "./ModalAddRent/ModalAddRent";

const AdminRent = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState("all");
  const [roomName, setRoomName] = useState("");
  const [filteredRentData, setFilteredRentData] = useState([]);

  // Fetch houses data
  const { data: housesData } = useQuery({
    queryKey: ["houses"],
    queryFn: getAllHouseService,
  });

  // Fetch rent data
  const { data: rentData } = useQuery({
    queryKey: ["rent-list"],
    queryFn: getAllRentService,
  });

  console.log("rentData", rentData);

  // Filter rent data based on selected house and room name
  useEffect(() => {
    if (rentData?.DT) {
      const filtered = rentData.DT.filter((rent) => {
        const matchesHouse =
          selectedHouse === "all" ||
          rent.PhongTro?.Nha?.MaNha === parseInt(selectedHouse);

        const matchesRoomName =
          roomName === "" ||
          (rent.PhongTro?.TenPhong&&
            rent.PhongTro.TenPhong.toLowerCase().includes(
              roomName.toLowerCase()
            ));

        return matchesRoomName && matchesHouse;
      });

      setFilteredRentData(filtered);
    }
  }, [rentData, selectedHouse, roomName]);

  return (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-3">
        <FaFileContract className="size-5" />
        <h1 className="text-2xl font-semibold ">Quản lý thuê phòng</h1>
      </div>

      <Card className="mb-4 rounded-xs py-2 shadow-none">
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
                    <label className="block text-md font-medium mb-1 mr-5">
                      Nhà
                    </label>
                    <Select
                      value={selectedHouse}
                      onValueChange={(value) => setSelectedHouse(value)}
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
                      className="rounded shadow-none"
                      placeholder="Nhập tên phòng"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Danh sách hợp đồng</h3>
        <div className="flex gap-2">
          <ModalAddRent />
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white rounded cursor-pointer hover:text-white">
            <Download className="h-4 w-4" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="rounded overflow-hidden">
        <TableRent filteredData={filteredRentData} />
      </div>
    </div>
  );
};

export default AdminRent;
