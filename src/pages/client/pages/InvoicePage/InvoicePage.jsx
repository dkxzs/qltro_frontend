import TableInvoice from "./TableInvoice.jsx";

const InvoicePage = ({ isLoading }) => {
  const invoices = [];
  return (
    <div className="container mx-auto mt-20">
      <h1 className="text-3xl font-bold text-center  mb-6">
        Hóa đơn phòng trọ
      </h1>
      <div className="min-h-96">
        <TableInvoice invoices={invoices} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default InvoicePage;
