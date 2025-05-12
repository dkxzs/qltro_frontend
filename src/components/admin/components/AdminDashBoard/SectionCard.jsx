import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatCurrency";
import { House, Users } from "lucide-react";
import { GiMoneyStack } from "react-icons/gi";
import { MdBedroomChild, MdBedroomParent } from "react-icons/md";

const SectionCards = () => {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-5 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card py-2 justify-center gap-3 rounded-md shadow-none">
        <CardHeader className="relative">
          <CardDescription>
            <House className="text-blue-500" />
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            5
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
            20
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
            13
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
            13
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
            {formatCurrency(12000000)} đ
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
            {formatCurrency(1200000000)} đ
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground font-semibold">Doanh thu</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SectionCards;
