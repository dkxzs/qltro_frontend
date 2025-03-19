import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, RefreshCw, Trash, Trash2, User } from "lucide-react";
import React from "react";

const TableRoom = (props) => {
  const { roomData } = props;
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-center">STT</TableHead>
            <TableHead>Mã phòng</TableHead>
            <TableHead>Diện tích (m2)</TableHead>
            <TableHead>Số người ở tối đa</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roomData.map((room, index) => (
            <TableRow
              key={room.id}
              className={index % 2 === 0 ? "bg-blue-50" : ""}
            >
              <TableCell className="text-center">{room.id}</TableCell>
              <TableCell>{room.roomCode}</TableCell>
              <TableCell>{room.area}</TableCell>
              <TableCell>{room.maxOccupants}</TableCell>
              <TableCell>{room.price.toLocaleString()}</TableCell>
              <TableCell className="max-w-md truncate">
                {room.description}
              </TableCell>
              <TableCell>
                <div
                  className={
                    room.status === "Đã cho thuê"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : room.status === "Còn trống"
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  }
                >
                  {room.status}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-1">
                  {room.status === "Đã cho thuê" && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600 hover:text-white cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 hover:text-white cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 hover:text-white cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 hover:text-white cursor-pointer"
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
  );
};

export default TableRoom;
