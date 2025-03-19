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
import {
  ChevronDown,
  ChevronUp,
  Download,
  Home,
  Plus,
  Trash,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import TableRoom from "./TableRoom/TableRoom";
import Pagination from "../Pagination/Pagination";

const roomData = [
  {
    id: 1,
    roomCode: "100A",
    area: 16,
    maxOccupants: 10,
    price: 5500000,
    description:
      "Cho thuê căn hộ Belleza, P Phú Mỹ, Quận 7. * Căn hộ thiết kế 1PN,...",
    status: "Đã cho thuê",
  },
  {
    id: 2,
    roomCode: "100B",
    area: 16,
    maxOccupants: 10,
    price: 3500000,
    description: "Cho thuê phòng CHUNG CƯ NEW SAI GON - Quận 7 (chính chủ k...",
    status: "Còn trống",
  },
  {
    id: 3,
    roomCode: "101A",
    area: 15,
    maxOccupants: 10,
    price: 4000000,
    description: "STUDIO/DUPLEX MÁY GIẶT RIÊNG NGAY TÂN QUY SÁT LOTTE ...",
    status: "Đã đặt cọc",
  },
  {
    id: 4,
    roomCode: "101B",
    area: 20,
    maxOccupants: 10,
    price: 6000000,
    description: "CĂN HỘ MINI BAN CÔNG, FULL NỘI THẤT TIỆN NGHI, MÁY GIẶT ...",
    status: "Đã cho thuê",
  },
  {
    id: 5,
    roomCode: "102A",
    area: 15,
    maxOccupants: 10,
    price: 2500000,
    description: "CHO THUÊ PHÒNG TRỌ HSSV GẦN ĐH MỞ Phòng sàn máy lạnh, ...",
    status: "Còn trống",
  },
];

const AdminRoom = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [currentTab, setCurrentTab] = useState("nha-q7");

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold mb-4">Quản lý phòng trọ</h2>
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
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-27 text-sm">Tên phòng:</label>
                  <Input
                    placeholder="Nhập tên phòng"
                    className="flex-1 rounded-none outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-25 text-sm">Trạng thái:</label>
                  <Select
                    defaultValue="all"
                    className="rounded-none outline-none focus-visible:ring-0 focus-visible:border-0"
                  >
                    <SelectTrigger className="flex-1 rounded-none cursor-pointer">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
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
                      <SelectItem
                        className="hover:bg-transparent cursor-pointer"
                        value="deposit"
                      >
                        Đã đặt cọc
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
        <Tabs defaultValue={currentTab} onValueChange={setCurrentTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger className="cursor-pointer" value="nha-q7">
                Nhà Q7
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="nha-nha-be">
                Nhà Nhà Bè
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700 cursor-pointer rounded-sm hover:text-white">
                <Plus className="h-4 w-4" />
                Thêm phòng
              </Button>
              <Button
                variant="outline"
                className="bg-yellow-500 hover:bg-yellow-500 text-white rounded-sm   cursor-pointer hover:text-white"
              >
                <Download className="h-4 w-4" />
                Xuất dữ liệu
              </Button>
              <Button
                variant="outline"
                className="bg-blue-600 hover:bg-blue-700 rounded-sm text-white cursor-pointer hover:text-white"
              >
                <Home className="h-4 w-4" />
                Cập nhật nhà
              </Button>
              <Button
                variant="outline"
                className="bg-red-600 hover:bg-red-700 text-white rounded-sm  cursor-pointer hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                Xóa nhà
              </Button>
            </div>
          </div>

          <TabsContent value="nha-q7" className="mt-4">
            <div className="min-h-[380px]">
              <div className="rounded border overflow-hidden">
                <TableRoom roomData={roomData} />
              </div>
            </div>
            <div className="my-2">
              <Pagination />
            </div>
          </TabsContent>

          <TabsContent value="nha-nha-be" className="mt-4">
            <div className="rounded-md border p-8 text-center text-muted-foreground">
              Không có dữ liệu cho Nhà Nhà Bè
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminRoom;
