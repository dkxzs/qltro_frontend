import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllCustomerService } from "@/services/customerServices";
import { getAllExpensesService } from "@/services/expenseServices";
import { getAllHouseService } from "@/services/houseServices";
import { getAllInvoiceService } from "@/services/invoiceServices";
import { getAllPaymentService } from "@/services/paymentServices";
import { getAllRoomService } from "@/services/roomServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { House, Receipt, Users, Wallet } from "lucide-react";
import { GiMoneyStack } from "react-icons/gi";
import { MdOutlineBedroomChild, MdOutlineBedroomParent } from "react-icons/md";

const SectionCards = () => {
  const date = new Date();
  const { data: dataHouse } = useQuery({
    queryKey: ["get-house"],
    queryFn: getAllHouseService,
  });

  const { data: dataRoom } = useQuery({
    queryKey: ["get-room"],
    queryFn: getAllRoomService,
  });

  let totalRoomUsed = 0;
  dataRoom?.DT.forEach((item) => {
    if (item.TrangThai == 1) {
      totalRoomUsed++;
    }
  });

  const { data: dataUser } = useQuery({
    queryKey: ["get-user"],
    queryFn: () => getAllCustomerService(false),
  });

  let totalCustomer = 0;
  dataUser?.DT.forEach((item) => {
    if (item.TrangThai) {
      totalCustomer++;
    }
  });

  const { data: dataPayment } = useQuery({
    queryKey: ["get-payment"],
    queryFn: getAllPaymentService,
  });

  let totalPayment = 0;
  dataPayment?.DT.forEach((item) => {
    totalPayment += item.SoTien;
  });

  const { data: dataInvoice } = useQuery({
    queryKey: ["get-bill"],
    queryFn: getAllInvoiceService,
  });

  let totalInvoice = 0;
  let unpaidInvoices = 0;
  dataInvoice?.DT.forEach((item) => {
    totalInvoice += item.TongTien;
    if (item.TrangThai == 0) {
      unpaidInvoices++;
    }
  });

  const { data: expenseData } = useQuery({
    queryKey: ["expenseReport", "current-month"],
    queryFn: () => getAllExpensesService(),
  });

  const totalExpense = expenseData?.DT.reduce((acc, item) => {
    if (item.NguoiChiTra == "Chủ trọ" && item.Thang == date.getMonth() + 1) {
      return acc + item.TongTien;
    }
  }, 0);

  return (
    <div className=" @xl/main:grid-cols-2 @5xl/main:grid-cols-5 grid grid-cols-1 gap-4 ">
      <Card className="@container/card py-2 justify-center gap-3 rounded-[6px] shadow-none border-l-6 border-l-blue-500">
        <CardHeader className="relative">
          <CardDescription>
            <House className="text-blue-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {dataHouse?.DT.length || 0}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
          <div className="text-muted-foreground font-semibold">Tổng số nhà</div>
        </CardFooter>
      </Card>
      <Card className="@container/card py-2 justify-center gap-3 rounded-[6px] shadow-none border-l-6 border-l-teal-500">
        <CardHeader className="relative">
          <CardDescription>
            <MdOutlineBedroomParent className="size-7 text-teal-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {dataRoom?.DT.length || 0}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground font-semibold">
            Tổng số phòng
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card py-2 justify-center gap-3 rounded-[6px] shadow-none border-l-6 border-l-green-500">
        <CardHeader className="relative">
          <CardDescription>
            <MdOutlineBedroomChild className="size-7 text-green-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalRoomUsed}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground font-semibold">
            Phòng được sử dụng
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card py-2 justify-center gap-3 rounded-[6px] shadow-none border-l-6 border-l-purple-500">
        <CardHeader className="relative">
          <CardDescription>
            <Users className="text-purple-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalCustomer}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground font-semibold">
            Số khách đang trọ
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card py-2 justify-center gap-3 rounded-[6px] shadow-none border-l-6 border-l-green-600">
        <CardHeader className="relative">
          <CardDescription>
            <GiMoneyStack className="size-7 text-green-600" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatCurrency(totalPayment)} đ
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground font-semibold">Doanh thu</div>
        </CardFooter>
      </Card>
      <Card className="@container/card py-2 justify-center gap-3 rounded-[6px] shadow-none border-l-6 border-l-red-500">
        <CardHeader className="relative">
          <CardDescription>
            <Receipt className="text-red-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {unpaidInvoices}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground font-semibold">
            Hóa đơn chưa thanh toán
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card py-2 justify-center gap-3 rounded-[6px] shadow-none border-l-6 border-l-orange-500">
        <CardHeader className="relative">
          <CardDescription>
            <Wallet className="text-orange-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatCurrency(totalExpense)} đ
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground font-semibold">
            Tổng chi phí (tháng {new Date().getMonth() + 1})
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card py-2 justify-center gap-3 rounded-[6px] shadow-none border-l-6 border-l-yellow-500">
        <CardHeader className="relative">
          <CardDescription>
            <GiMoneyStack className="size-7 text-yellow-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatCurrency(totalInvoice - totalPayment)} đ
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground font-semibold">Nợ hóa đơn</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SectionCards;
