import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getRoomStatusSummaryService } from "@/services/reportServices";

const COLORS = ["#36A2EB", "#f0b520"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DashboardRoomStatus = () => {
  const { data: roomStatusData, isLoading: roomStatusLoading } = useQuery({
    queryKey: ["roomStatusSummary"],
    queryFn: () => getRoomStatusSummaryService(),
  });

  // Xử lý dữ liệu từ API
  const processedRoomStatus = roomStatusData?.DT
    ? [
        {
          name: "Đang thuê",
          value: parseFloat(roomStatusData.DT.occupiedPercentage),
        },
        {
          name: "Phòng trống",
          value: parseFloat(roomStatusData.DT.vacantPercentage),
        },
      ]
    : [];

  // Kiểm tra không có dữ liệu
  const hasData =
    roomStatusData?.DT &&
    (roomStatusData.DT.totalRooms > 0 ||
      roomStatusData.DT.occupiedRooms > 0 ||
      roomStatusData.DT.vacantRooms > 0);

  return (
    <Card className="rounded border border-gray-200 shadow-none px-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-black">
          Trạng thái phòng
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer rounded"
          onClick={() => toast.info("Xuất dữ liệu trạng thái phòng")}
        >
          <Download className="h-4 w-4 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {roomStatusLoading ? (
            <div className="w-64 h-64 flex items-center justify-center">
              <p className="text-gray-500">Đang tải...</p>
            </div>
          ) : !hasData ? (
            <div className="w-64 h-64 flex items-center justify-center">
              <p className="text-gray-500">Không có dữ liệu trạng thái phòng</p>
            </div>
          ) : (
            <>
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processedRoomStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {processedRoomStatus.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-2 mt-4">
                <Badge className="bg-[#36A2EB] hover:bg-[#1d4ed8]">
                  Đang thuê
                </Badge>
                <Badge className="bg-[#f0b520] hover:bg-[#facc15]">
                  Phòng trống
                </Badge>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardRoomStatus;