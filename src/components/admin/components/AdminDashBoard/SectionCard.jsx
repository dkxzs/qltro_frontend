import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllCustomerService } from "@/services/customerServices";
import { getAllHouseService } from "@/services/houseServices";
import { getAllInvoiceService } from "@/services/invoiceServices";
import { getAllPaymentService } from "@/services/paymentServices";
import { getAllRoomService } from "@/services/roomServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { House, Users } from "lucide-react";
import { GiMoneyStack } from "react-icons/gi";
import { MdBedroomChild, MdBedroomParent } from "react-icons/md";

const SectionCards = () => {
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
  dataInvoice?.DT.forEach((item) => {
    totalInvoice += item.TongTien;
  });

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-5 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card py-2 justify-center gap-3 rounded-md shadow-none">
        <CardHeader className="relative">
          <CardDescription>
            <House className="text-blue-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {dataHouse?.DT.length}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
          <div className="text-muted-foreground font-semibold">Tổng số nhà</div>
        </CardFooter>
      </Card>
      <Card className="@container/card py-2 justify-center gap-3 rounded-md shadow-none">
        <CardHeader className="relative">
          <CardDescription>
            <MdBedroomParent className="size-7 text-teal-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {dataRoom?.DT.length}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground font-semibold">
            Tổng số phòng
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card py-2 justify-center gap-3 rounded-md shadow-none">
        <CardHeader className="relative">
          <CardDescription>
            <MdBedroomChild className="size-7 text-green-500" />
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
      <Card className="@container/card py-2 justify-center gap-3 rounded-md shadow-none">
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
      <Card className="@container/card py-2 justify-center gap-3 rounded-md shadow-none">
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
      <Card className="@container/card py-2 justify-center gap-3 rounded-md shadow-none">
        <CardHeader className="relative">
          <CardDescription>
            <GiMoneyStack className="size-7 text-yellow-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {formatCurrency(totalInvoice - totalPayment)} đ
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground font-semibold">Nợ hoá đơn</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SectionCards;
