import Pagination from "@/components/admin/components/Pagination/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import RoomList from "./RoomList";
import { useQuery } from "@tanstack/react-query";
import { getAllAvailableRoomsService } from "@/services/roomServices";
import { useState, useMemo } from "react";

const RoomPage = () => {
  const { data: roomData, isLoading } = useQuery({
    queryKey: ["available-rooms"],
    queryFn: () => getAllAvailableRoomsService(),
  });

  // Trạng thái bộ lọc
  const [addressFilter, setAddressFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  // Lọc dữ liệu phòng dựa trên các tiêu chí
  const filteredRooms = useMemo(() => {
    let filtered = roomData?.DT || [];

    // Lọc theo địa chỉ
    if (addressFilter) {
      filtered = filtered.filter((room) =>
        room.Nha?.DiaChi?.toLowerCase().includes(addressFilter.toLowerCase())
      );
    }

    // Lọc theo diện tích
    if (areaFilter) {
      filtered = filtered.filter((room) => {
        const area = room.DienTich || 0;
        if (areaFilter === "10-15") return area >= 10 && area <= 15;
        if (areaFilter === "15-20") return area > 15 && area <= 20;
        if (areaFilter === "over-20") return area > 20;
        return true;
      });
    }

    // Lọc theo loại phòng
    if (roomTypeFilter) {
      filtered = filtered.filter((room) => {
        const roomType = room.LoaiPhong?.TenLoaiPhong?.toLowerCase() || "";
        const description = room.MoTa?.toLowerCase() || "";
        if (roomTypeFilter === "normal")
          return (
            roomType.includes("phòng thường") || roomType.includes("phòng trọ")
          );
        if (roomTypeFilter === "convenient")
          return description.includes("tiện nghi");
        if (roomTypeFilter === "premium")
          return description.includes("cao cấp");
        return true;
      });
    }

    // Lọc theo giá thuê
    if (priceFilter) {
      filtered = filtered.filter((room) => {
        const price = room.LoaiPhong?.DonGia || 0;
        if (priceFilter === "under-5m") return price < 5000000;
        if (priceFilter === "5-10m")
          return price >= 5000000 && price <= 10000000;
        if (priceFilter === "over-10m") return price > 10000000;
        return true;
      });
    }

    return filtered;
  }, [roomData, addressFilter, areaFilter, roomTypeFilter, priceFilter]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto py-5">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="bg-white border-b shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span>Trang chủ</span>
            <span className="mx-2">{">"}</span>
            <span>Thuê phòng trọ</span>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Nhập địa chỉ"
                className="pl-10 h-12 bg-gray-100 border shadow-none rounded"
                value={addressFilter}
                onChange={(e) => setAddressFilter(e.target.value)}
              />
            </div>

            <Select onValueChange={(value) => setAreaFilter(value)}>
              <SelectTrigger className="w-full md:w-40 h-12 outline-none focus:outline-none py-6 bg-gray-100 border cursor-pointer shadow-none rounded">
                <SelectValue placeholder="Diện tích" />
              </SelectTrigger>
              <SelectContent className="cursor-pointer">
                <SelectItem value="10-15">10 - 15m2</SelectItem>
                <SelectItem value="15-20">15 - 20m2</SelectItem>
                <SelectItem value="over-20">trên 20m2</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setRoomTypeFilter(value)}>
              <SelectTrigger className="w-full md:w-40 h-12 outline-none focus:outline-none py-6 bg-gray-100 border shadow-none cursor-pointer rounded">
                <SelectValue placeholder="Loại phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Phòng thường</SelectItem>
                <SelectItem value="convenient">Phòng tiện nghi</SelectItem>
                <SelectItem value="premium">Phòng cao cấp</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setPriceFilter(value)}>
              <SelectTrigger className="w-full md:w-40 h-12 outline-none focus:outline-none py-6 bg-gray-100 border shadow-none rounded">
                <SelectValue placeholder="Giá thuê phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-5m">Dưới 5 triệu</SelectItem>
                <SelectItem value="5-10m">5-10 triệu</SelectItem>
                <SelectItem value="over-10m">Trên 10 triệu</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full md:w-auto px-8 bg-blue-500 hover:bg-blue-600 h-12 cursor-pointer text-white rounded">
              <Search className="w-4 h-4" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            BẠN CẦN TÌM PHÒNG TRỌ UY TÍN TẠI HÀ NỘI?
          </h1>
          <p className="text-gray-600 max-w-4xl mx-auto">
            Bạn cần tìm phòng trọ tại Hà Nội. Hãy đến với hệ thống của chúng tôi
          </p>
        </div>

        <RoomList rooms={filteredRooms} />
        <div className="mt-5">
          <Pagination />
        </div>
      </main>
    </div>
  );
};

export default RoomPage;
