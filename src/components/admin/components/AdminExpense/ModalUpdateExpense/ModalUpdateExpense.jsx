import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateExpenseService } from "@/services/expenseServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { Loader2, Pencil, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

const ModalUpdateExpense = ({ dataUpdate, refetch, disabled }) => {
  const [open, setOpen] = useState(false);
  const [displayTongTien, setDisplayTongTien] = useState("");
  const [formData, setFormData] = useState({
    maNha: "",
    maPT: "",
    tongTien: "",
    moTa: "",
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ maCPPS, data }) => updateExpenseService(maCPPS, data),
    onSuccess: (response) => {
      if (response.EC === 0) {
        toast.success("Cập nhật chi phí phát sinh thành công");
        setOpen(false);
        refetch();
      } else {
        toast.error(response.EM);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật chi phí phát sinh");
    },
  });

  useEffect(() => {
    if (dataUpdate && open) {
      const tongTien = dataUpdate.TongTien?.toString() || "";
      setFormData({
        maNha: dataUpdate.MaNha?.toString() || "",
        maPT: dataUpdate.MaPT?.toString() || "",
        tongTien,
        moTa: dataUpdate.MoTa || "",
      });
      setDisplayTongTien(tongTien ? formatCurrency(tongTien) : "");
    }
  }, [dataUpdate, open]);

  useEffect(() => {
    setDisplayTongTien(
      formData.tongTien ? formatCurrency(formData.tongTien) : ""
    );
  }, [formData.tongTien]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tongTien") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const parsedValue = numericValue ? parseInt(numericValue, 10) : "";
      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
      setDisplayTongTien(parsedValue ? formatCurrency(parsedValue) : "");
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tongTien) {
      toast.error("Vui lòng nhập tổng tiền!");
      return;
    }

    const parsedTongTien = parseInt(formData.tongTien, 10);
    if (isNaN(parsedTongTien) || parsedTongTien <= 0) {
      toast.error("Tổng tiền phải là số lớn hơn 0!");
      return;
    }

    const data = {
      MaNha: formData.maNha ? parseInt(formData.maNha, 10) : null,
      MaPT: formData.maPT ? parseInt(formData.maPT, 10) : null,
      TongTien: parsedTongTien,
      MoTa: formData.moTa,
    };

    updateExpenseMutation.mutate({ maCPPS: dataUpdate.MaCPPS, data });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setFormData({
            maNha: "",
            maPT: "",
            tongTien: "",
            moTa: "",
          });
          setDisplayTongTien("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          disabled={disabled}
          aria-label="Mở modal cập nhật chi phí phát sinh"
        >
          <SquarePen className="size-5 text-blue-700" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-white shadow-md rounded w-2/5"
        aria-describedby="update-expense-description"
      >
        <DialogHeader>
          <DialogTitle>Cập nhật chi phí phát sinh</DialogTitle>
          <div
            id="update-expense-description"
            className="text-sm text-gray-500"
          >
            Vui lòng cập nhật thông tin chi phí phát sinh.
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4 bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tongTien" className="text-right">
                Tổng tiền <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="tongTien"
                  name="tongTien"
                  type="text"
                  value={displayTongTien}
                  onChange={handleChange}
                  required
                  className="rounded shadow-none"
                  placeholder="Nhập số tiền (VD: 1,000,000)"
                  aria-label="Nhập tổng tiền"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="moTa" className="text-right">
                Mô tả
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="moTa"
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleChange}
                  rows={3}
                  className="rounded shadow-none"
                  placeholder="Nhập mô tả chi phí (nếu có)"
                  aria-label="Nhập mô tả chi phí"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updateExpenseMutation.isPending}
              aria-label="Cập nhật chi phí phát sinh"
            >
              {updateExpenseMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Lưu"
              )}
            </Button>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white rounded cursor-pointer"
              variant="destructive"
              aria-label="Hủy cập nhật chi phí"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateExpense;
