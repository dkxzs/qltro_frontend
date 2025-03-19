import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";

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

const AdminRoomType = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">Loại phòng</h1>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700 cursor-pointer hover:text-white rounded-sm">
            <Plus className=" h-4 w-4" /> Thêm mới
          </Button>
          <Button className="bg-yellow-400 hover:bg-yellow-500 cursor-pointer hover:text-white rounded-sm">
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
                Tên
              </TableHead>
              <TableHead className="py-3 px-4 text-left font-medium">
                Loại dịch vụ
              </TableHead>
              <TableHead className="py-3 px-4 text-left font-medium">
                Đơn giá
              </TableHead>
              <TableHead className="py-3 px-4 text-left font-medium">
                Đơn vị tính
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
                <TableCell className="py-3 px-4">{service.unit}</TableCell>
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

export default AdminRoomType;
