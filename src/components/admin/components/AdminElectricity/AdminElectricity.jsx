"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MdElectricBolt } from "react-icons/md";
import TableElectricity from "./TableElectricity/TableElectricity";

const AdminElectricity = () => {
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
      <div className="mb-4 flex items-center gap-3">
        <MdElectricBolt className="size-6 text-gray-600" />
        <h1 className="text-2xl font-semibold text-gray-600">Chỉ số điện</h1>
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
              <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="block text-md font-medium text-gray-600 mb-1 w-27">
                      Tháng/năm
                    </label>
                    <Input
                      type="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full rounded shadow-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="block text-md font-medium text-gray-600 mb-1 mr-5">
                      Nhà
                    </label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full rounded shadow-none cursor-pointer">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent className="rounded shadow-none cursor-pointer">
                        <SelectItem className="cursor-pointer" value="all">
                          Tất cả
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="house1">
                          Nhà 1
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="house2">
                          Nhà 2
                        </SelectItem>
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
        <TableElectricity meterData={meterData} />
      </div>
    </div>
  );
};

export default AdminElectricity;
