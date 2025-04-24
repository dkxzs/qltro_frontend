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
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateExpense = ({ dataUpdate, refetch, disabled }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayTongTien, setDisplayTongTien] = useState("");
  const [formData, setFormData] = useState({
    maNha: "",
    maPT: "",
    tongTien: "",
    moTa: "",
  });

  // Đồng bộ dữ liệu khi mở modal
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

  // Đồng bộ giá trị hiển thị tổng tiền
  useEffect(() => {
    setDisplayTongTien(
      formData.tongTien ? formatCurrency(formData.tongTien) : ""
    );
  }, [formData.tongTien]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "thangNam" && value) {
      const [nam, thang] = value.split("-");
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        thang: parseInt(thang, 10),
        nam: parseInt(nam, 10),
      }));
    } else if (name === "tongTien") {
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
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const parsedTongTien = parseInt(formData.tongTien, 10);
    if (isNaN(parsedTongTien) || parsedTongTien <= 0) {
      toast.error("Tổng tiền phải là số lớn hơn 0");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = {
        MaNha: formData.maNha ? parseInt(formData.maNha, 10) : null,
        MaPT: formData.maPT ? parseInt(formData.maPT, 10) : null,
        TongTien: parsedTongTien,
        MoTa: formData.moTa,
      };

      const response = await updateExpenseService(dataUpdate.MaCPPS, data);

      if (response.EC === 0) {
        toast.success("Cập nhật chi phí phát sinh thành công");
        setOpen(false);
        refetch();
      } else {
        toast.error(response.EM);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật chi phí phát sinh");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mr-2 flex items-center cursor-pointer bg-blue-500 hover:bg-blue-600 rounded text-white"
          disabled={disabled}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-2/5 rounded"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật chi phí phát sinh</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
                  placeholder="Nhập số tiền (VD: 1000000)"
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
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded"
            >
              {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateExpense;
