import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPaymentService,
  getPaymentByInvoiceIdService,
} from "@/services/paymentServices";
import { BsCash } from "react-icons/bs";
import { Tooltip } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "react-toastify";

const parseCurrency = (value) => {
  if (!value) return 0;
  const numberString = value.replace(/\D/g, "");
  return Number(numberString);
};

const ModalPayment = ({ invoiceId, invoiceData }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    ngaythanhtoan: new Date().toISOString().split("T")[0],
    sotien: "",
  });
  const [error, setError] = useState("");

  const { data: payments } = useQuery({
    queryKey: ["payments", invoiceId],
    queryFn: () => getPaymentByInvoiceIdService(invoiceId),
    enabled: !!invoiceId,
  });

  const totalPaid = payments?.reduce((sum, p) => sum + p.SoTien, 0) || 0;
  const totalInvoice = invoiceData?.TongTien || 0;
  const remaining = totalInvoice - totalPaid;

  const addPaymentMutation = useMutation({
    mutationFn: addPaymentService,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["payments", invoiceId]);
      queryClient.invalidateQueries(["invoice", invoiceId]);
      setPaymentData({
        ngaythanhtoan: new Date().toISOString().split("T")[0],
        sotien: "",
      });
      setError("");
      setOpen(false);
      if (res.EC === 0) {
        toast.success("Thanh toán thành công!");
      }
    },
    onError: (error) => {
      setError(error.response?.data?.EM || "Có lỗi xảy ra");
      toast.error(error.response?.data?.EM || "Có lỗi xảy ra");
    },
  });

  const handleSubmit = () => {
    setError("");
    const { ngaythanhtoan, sotien } = paymentData;

    const sotienNumber = parseCurrency(sotien);

    if (!ngaythanhtoan) {
      toast.warning("Vui lòng chọn ngày thanh toán!");
      return;
    }
    if (!sotien || sotienNumber <= 0) {
      toast.warning("Vui lòng nhập số tiền hợp lệ!");
      return;
    }
    if (sotienNumber > remaining) {
      toast.warning("Số tiền vượt quá số tiền còn lại!");
      return;
    }

    addPaymentMutation.mutate({
      mahd: invoiceId,
      ngaythanhtoan,
      sotien: sotienNumber,
    });
  };

  const handleChangeSotien = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setPaymentData({ ...paymentData, sotien: rawValue });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-transparent border-none rounded-none shadow-none outline-none cursor-pointer"
          disabled={remaining <= 0}
        >
          <Tooltip>
            <BsCash className="size-4 text-green-600" />
          </Tooltip>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-2/5 rounded" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Thu tiền</DialogTitle>
        </DialogHeader>
        <div>
          <p className="my-1">Tổng tiền: {formatCurrency(totalInvoice)}</p>
          <p className="my-1">Đã thanh toán: {formatCurrency(totalPaid)}</p>
          <p className="my-1">Còn lại: {formatCurrency(remaining)}</p>
          {error && <p className="text-red-500">{error}</p>}
          <div className="mb-4">
            <Label className="block my-2 text-md">Ngày thanh toán:</Label>
            <input
              type="date"
              value={paymentData.ngaythanhtoan}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  ngaythanhtoan: e.target.value,
                })
              }
              className="border rounded p-2 w-full shadow-none"
            />
          </div>
          <div className="mb-4">
            <Label className="block mb-1">Số tiền:</Label>
            <input
              type="text"
              value={formatCurrency(paymentData.sotien)}
              onChange={handleChangeSotien}
              placeholder="Nhập số tiền"
              className="border rounded p-2 w-full shadow-none text-right"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
            disabled={addPaymentMutation.isLoading}
          >
            Thanh toán
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="destructive"
            className="rounded cursor-pointer"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPayment;
