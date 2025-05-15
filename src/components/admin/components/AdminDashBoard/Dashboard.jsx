"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Download, Send } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

export default function Dashboard() {
  // Dữ liệu cho biểu đồ tròn trạng thái phòng
  const roomStatusData = [
    { name: "Đang thuê", value: 33.33, color: "#00897B" },
    { name: "Phòng trống", value: 66.67, color: "#FF9800" },
  ];

  // Dữ liệu chi tiết cho biểu đồ cột doanh thu
  const revenueData = [
    {
      name: "1/2024",
      "Nhà Q7": 18500000,
      "Nhà Nhà Bè": 8200000,
    },
    {
      name: "2/2024",
      "Nhà Q7": 22242794,
      "Nhà Nhà Bè": 9184138,
    },
  ];

  // Dữ liệu cho biểu đồ chi phí
  const expenseData = [
    { name: "T1", "Điện nước": 3200000, "Bảo trì": 1500000, Khác: 800000 },
    { name: "T2", "Điện nước": 3500000, "Bảo trì": 500000, Khác: 1200000 },
    { name: "T3", "Điện nước": 3300000, "Bảo trì": 2000000, Khác: 600000 },
    { name: "T4", "Điện nước": 3600000, "Bảo trì": 800000, Khác: 900000 },
  ];

  // Dữ liệu cho biểu đồ tỷ lệ lấp đầy theo thời gian
  const occupancyData = [
    { name: "T11/23", "Tỷ lệ lấp đầy": 60 },
    { name: "T12/23", "Tỷ lệ lấp đầy": 65 },
    { name: "T1/24", "Tỷ lệ lấp đầy": 70 },
    { name: "T2/24", "Tỷ lệ lấp đầy": 75 },
  ];

  // Custom tooltip cho biểu đồ doanh thu
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-3 rounded shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {new Intl.NumberFormat("vi-VN").format(entry.value)}{" "}
              VND
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trạng thái phòng */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium text-gray-500">
              Trạng thái phòng
            </CardTitle>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roomStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {roomStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="bg-[#00897B] hover:bg-[#00796B]">
                  Đang thuê
                </Button>
                <Button className="bg-[#FF9800] hover:bg-[#F57C00]">
                  Phòng trống
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doanh thu */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium text-gray-500">
              Doanh thu ( VND )
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="2-months">
                <SelectTrigger className="w-[180px] border-teal-500 text-teal-500">
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-months">2 tháng gần đây</SelectItem>
                  <SelectItem value="3-months">3 tháng gần đây</SelectItem>
                  <SelectItem value="6-months">6 tháng gần đây</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Nhà Q7" fill="#36A2EB" />
                  <Bar dataKey="Nhà Nhà Bè" fill="#FFCE56" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Khách sắp hết hạn hợp đồng */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium text-gray-500">
              Khách sắp hết hạn hợp đồng
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-orange-100 text-orange-500"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-200 text-gray-500"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <AreaChart
                width={500}
                height={120}
                data={occupancyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Area
                  type="monotone"
                  dataKey="Tỷ lệ lấp đầy"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">STT</TableHead>
                  <TableHead>Nhà</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead className="text-right">Ngày</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="h-32 text-center">
                  <TableCell colSpan={5} className="text-gray-500">
                    No Rows To Show
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tổng chi */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium text-gray-500">
              Tổng chi ( VND )
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="current-month">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Tháng hiện tại</SelectItem>
                  <SelectItem value="last-month">Tháng trước</SelectItem>
                  <SelectItem value="3-months">3 tháng gần đây</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={expenseData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("vi-VN").format(value) + " VND"
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Điện nước"
                    stroke="#FF6384"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="Bảo trì" stroke="#4BC0C0" />
                  <Line type="monotone" dataKey="Khác" stroke="#FFCE56" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
