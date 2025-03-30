import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const services = [
  {
    id: 1,
    name: "Điện",
    type: "Điện",
    price: 3000,
    unit: "kW/h",
    status: true,
  },
  {
    id: 2,
    name: "Wifi",
    type: "Khác",
    price: 250000,
    unit: "Router",
    status: true,
  },
  {
    id: 3,
    name: "Xe máy",
    type: "Khác",
    price: 50000,
    unit: "chiếc",
    status: true,
  },
  {
    id: 4,
    name: "Nước",
    type: "Nước",
    price: 20000,
    unit: "cm3",
    status: true,
  },
  {
    id: 5,
    name: "Vệ sinh",
    type: "Khác",
    price: 20000,
    unit: "Người",
    status: true,
  },
];

const AdminBuilding = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  return (
    <div className=" mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Quản lý nhà</h2>
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
                  <label className="w-27 text-sm">Tên nhà:</label>
                  <Input
                    placeholder="Nhập tên nhà"
                    className="flex-1 rounded-none outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">Danh sách nhà</h1>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700 cursor-pointer hover:text-white rounded">
            <Plus className=" h-4 w-4" /> Thêm mới
          </Button>
          <Button className="bg-yellow-400 hover:bg-yellow-500 cursor-pointer hover:text-white rounded">
            <Download className=" h-4 w-4" /> Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="border rounded overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b">
              <TableHead className="py-3 px-4 text-left font-medium">
                STT
              </TableHead>
              <TableHead className="py-3 px-4 text-left font-medium">
                Tên nhà
              </TableHead>
              <TableHead className="py-3 px-4 text-left font-medium">
                Địa chỉ
              </TableHead>
              <TableHead className="py-3 px-4 text-left font-medium">
                Mô tả
              </TableHead>
              <TableHead className="py-3 px-4 text-left font-medium">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service, index) => (
              <TableRow key={index} className="border-b hover:bg-gray-50">
                <TableCell className="py-3 px-4">{service.id}</TableCell>
                <TableCell className="py-3 px-4">{service.name}</TableCell>
                <TableCell className="py-3 px-4">{service.type}</TableCell>
                <TableCell className="py-3 px-4">
                  {service.price.toLocaleString()}
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex gap-1 ">
                    <Button
                      size="icon"
                      className="h-8 w-8 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-8 w-8 bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBuilding;
