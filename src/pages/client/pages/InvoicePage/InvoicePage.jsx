import { Button } from "@/components/ui/button";
import { getInvoiceByAccountIdService } from "@/services/invoiceServices.js";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TableInvoice from "./TableInvoice.jsx";

const InvoicePage = ({ isLoading }) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.account.account.accessToken);
  const decode = jwtDecode(token);

  const { data: invoiceData } = useQuery({
    queryKey: ["invoiceClient"],
    queryFn: () => getInvoiceByAccountIdService(decode.MaTK),
    enabled: !!decode.MaTK,
  });

  return (
    <div className="container mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            className="rounded-none bg-transparent outline-none cursor-pointer border-none shadow-none"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-6 text-blue-500" />
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-gray-700 bg-clip-text">
            Hóa đơn phòng trọ
          </h1>
        </div>
        <div></div>
      </div>
      <div className="lg:min-h-[500px]">
        <TableInvoice invoices={invoiceData} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default InvoicePage;
