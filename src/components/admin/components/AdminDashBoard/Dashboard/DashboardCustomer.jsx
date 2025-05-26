import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCustomerService } from "@/services/customerServices";
import { useQuery } from "@tanstack/react-query";
import { addMonths, format, startOfMonth } from "date-fns";
import { Loader2 } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const processCustomerData = (customerData) => {
  if (!customerData?.DT || !Array.isArray(customerData.DT)) return [];

  const currentDate = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const monthDate = addMonths(startOfMonth(currentDate), -i);
    months.push(format(monthDate, "MM/yyyy"));
  }

  // Tính số lượng khách hàng theo tháng
  const monthlyCounts = {};
  customerData.DT.forEach((customer) => {
    const createdAt = new Date(customer.createdAt);
    const monthYear = format(createdAt, "MM/yyyy");

    if (!monthlyCounts[monthYear]) {
      monthlyCounts[monthYear] = 0;
    }
    monthlyCounts[monthYear]++;
  });

  // Tạo dữ liệu biểu đồ với tất cả các tháng, điền 0 nếu không có dữ liệu
  return months
    .map((monthYear) => ({
      name: monthYear,
      "Số lượng": monthlyCounts[monthYear] || 0, // Nếu không có dữ liệu, gán 0
    }))
    .reverse(); // Đảo ngược để hiển thị từ tháng cũ nhất đến mới nhất
};

const DashboardCustomer = () => {
  const { data: customerData, isLoading: customerLoading } = useQuery({
    queryKey: ["customerData"],
    queryFn: () => getAllCustomerService(false),
  });

  const chartData = processCustomerData(customerData);

  return (
    <>
      {customerLoading ? (
        <div className="text-center text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Đang tải dữ liệu khách hàng...
        </div>
      ) : chartData.length > 0 ? (
        <Card className="rounded border border-gray-200 shadow-none px-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-black">
              Số lượng khách hàng theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Số lượng"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center text-gray-500">
          Không có dữ liệu khách hàng
        </div>
      )}
    </>
  );
};

export default DashboardCustomer;
