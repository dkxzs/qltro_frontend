"use client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, FileDown } from "lucide-react";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";

const AdminWater = () => {
  const [month, setMonth] = useState("12/2023");
  //   const [showWarning, setShowWarning] = useState(true);

  const meterData = [
    {
      id: 1,
      floor: "Tầng 1",
      room: "1",
      tenant: "",
      oldReading: "0",
      newReading: "0",
      usage: "0.0",
    },
    {
      id: 2,
      floor: "Tầng 1",
      room: "2",
      tenant: "",
      oldReading: "0",
      newReading: "0",
      usage: "0.0",
    },
    {
      id: 3,
      floor: "Tầng 1",
      room: "3",
      tenant: "",
      oldReading: "0",
      newReading: "0",
      usage: "0.0",
    },
    {
      id: 4,
      floor: "Tầng 1",
      room: "4",
      tenant: "",
      oldReading: "0",
      newReading: "0",
      usage: "0.0",
    },
    {
      id: 5,
      floor: "Tầng 1",
      room: "5",
      tenant: "",
      oldReading: "0",
      newReading: "0",
      usage: "0.0",
    },
  ];
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  return (
    <div className=" mx-auto p-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-600">Chỉ số nước</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-blue-500 hover:bg-blue-600 rounded-sm text-white border-none"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Xuất file excel
          </Button>
        </div>
      </div>
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
            <>
              <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-600 mb-1 w-27">
                      Tháng/năm
                    </label>
                    <Input
                      type="date"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full rounded"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-600 mb-1 mr-5">
                      Nhà
                    </label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full rounded">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="house1">Nhà 1</SelectItem>
                        <SelectItem value="house2">Nhà 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className=" p-4 ">
                <p className="text-sm text-gray-600 font-medium mb-1">Lưu ý:</p>
                <ul className="text-sm text-gray-600 list-inside">
                  <li>
                    - Bạn phải gắn dịch vụ thuộc loại điện cho khách thuê trước
                    thì phần chỉ số này mới được tính cho phòng đó khi tính
                    tiền.
                  </li>
                  <li>
                    - Đối với lần đầu tiên sử dụng phần mềm bạn sẽ phải nhập chỉ
                    số cũ và mới cho tháng sử dụng đầu tiên, các tháng tiếp theo
                    phần mềm sẽ tự động lấy chỉ số mới tháng trước làm chỉ số cũ
                    tháng sau.
                  </li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end mb-2">
        <div className="flex items-center space-x-2">
          <label
            htmlFor="warning"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Cảnh báo chỉ số điện cũ nhỏ hơn chỉ số điện mới
          </label>
        </div>
      </div>

      <div className="border rounded overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold">STT</TableHead>
              <TableHead className="font-semibold">Nhà</TableHead>
              <TableHead className="font-semibold ">Phòng</TableHead>
              <TableHead className="font-semibold text-right">
                CS Điện Cũ
              </TableHead>
              <TableHead className="font-semibold text-right">
                CS Điện Mới
              </TableHead>
              <TableHead className="font-semibold text-right">
                Sử dụng
              </TableHead>
              <TableHead className="font-semibold text-right">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meterData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.floor}</TableCell>
                <TableCell>{row.room}</TableCell>
                <TableCell className="text-right">
                  <Input
                    type="text"
                    value={row.oldReading}
                    className="w-full text-right"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="text"
                    value={row.newReading}
                    className="w-full text-right"
                  />
                </TableCell>
                <TableCell className="text-right">{row.usage}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded float-right"
                  >
                    Lưu
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-2">
        <Pagination />
      </div>
    </div>
  );
};

export default AdminWater;
