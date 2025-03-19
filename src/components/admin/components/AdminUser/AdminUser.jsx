import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Download, Plus } from "lucide-react";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import TableUser from "./TableUser/TableUser";
import ModalAddUser from "./ModalAddUser/ModalAddUser";

// Dữ liệu mẫu
const userData = [
  {
    id: 1,
    HoTen: "Nguyễn Văn A",
    CCCD: "024200305671",
    GioiTinh: "Nam",
    Email: "abc@gmail.com",
    DienThoai: "0123456789",
    DiaChi: "Thôn Chùa Xã Hương Vĩ Huyện Yên Thế Tỉnh Bắc Giang.",
  },
  {
    id: 1,
    HoTen: "Nguyễn Văn A",
    CCCD: "024200305671",
    GioiTinh: "Nam",
    Email: "abc@gmail.com",
    DienThoai: "0123456789",
    DiaChi: "Thôn Chùa Xã Hương Vĩ Huyện Yên Thế Tỉnh Bắc Giang.",
  },
  {
    id: 1,
    HoTen: "Nguyễn Văn A",
    CCCD: "024200305671",
    GioiTinh: "Nam",
    Email: "abc@gmail.com",
    DienThoai: "0123456789",
    DiaChi: "Thôn Chùa Xã Hương Vĩ Huyện Yên Thế Tỉnh Bắc Giang.",
  },
  {
    id: 1,
    HoTen: "Nguyễn Văn A",
    CCCD: "024200305671",
    GioiTinh: "Nam",
    Email: "abc@gmail.com",
    DienThoai: "0123456789",
    DiaChi: "Thôn Chùa Xã Hương Vĩ Huyện Yên Thế Tỉnh Bắc Giang.",
  },
  {
    id: 1,
    HoTen: "Nguyễn Văn A",
    CCCD: "024200305671",
    GioiTinh: "Nam",
    Email: "abc@gmail.com",
    DienThoai: "0123456789",
    DiaChi: "Thôn Chùa Xã Hương Vĩ Huyện Yên Thế Tỉnh Bắc Giang.",
  },
  {
    id: 1,
    HoTen: "Nguyễn Văn A",
    CCCD: "024200305671",
    GioiTinh: "Nam",
    Email: "abc@gmail.com",
    DienThoai: "0123456789",
    DiaChi: "Thôn Chùa Xã Hương Vĩ Huyện Yên Thế Tỉnh Bắc Giang.",
  },
  {
    id: 1,
    HoTen: "Nguyễn Văn A",
    CCCD: "024200305671",
    GioiTinh: "Nam",
    Email: "abc@gmail.com",
    DienThoai: "0123456789",
    DiaChi: "Thôn Chùa Xã Hương Vĩ Huyện Yên Thế Tỉnh Bắc Giang.",
  },
];

const AdminUser = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold mb-4">Quản lý khách trọ</h2>
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
                  <label className="w-27 text-sm">Tên khách trọ:</label>
                  <Input
                    placeholder="Nhập tên khách trọ"
                    className="flex-1 rounded-none outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Danh sách khách trọ</h3>
          <div className="flex items-center">
            <Button className="mr-2 flex items-center cursor-pointer bg-green-700 hover:bg-green-800 rounded-sm">
              <Plus className="h-5 w-5" />
              Thêm khách trọ
            </Button>
            <ModalAddUser />
            <Button className="mr-2 flex items-center cursor-pointer bg-yellow-500 hover:bg-yellow-600 rounded-sm">
              <Download className="h-5 w-5" />
              Xuất file
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-[380px]">
        <div className="rounded border overflow-hidden">
          <TableUser userData={userData} />
        </div>
      </div>
      <div className="my-2">
        <Pagination />
      </div>
    </div>
  );
};

export default AdminUser;
