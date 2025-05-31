import TableInvoice from "./TableInvoice.jsx";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InvoicePage = ({ isLoading }) => {
  const invoices = [];
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            className=" rounded-none bg-transparent outline-none cursor-pointer border-none shadow-none"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-6 text-blue-500" />
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-gray-700 bg-clip-text ">
            Hóa đơn phòng trọ
          </h1>
        </div>
        <div></div>
      </div>
      <div className="lg:min-h-[500px]">
        <TableInvoice invoices={invoices} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default InvoicePage;
