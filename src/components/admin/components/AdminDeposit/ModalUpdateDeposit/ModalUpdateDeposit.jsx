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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateDepositService } from "@/services/depositServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateDeposit = ({ deposit, refetch }) => {

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    MaDC: deposit.MaDC,
    MaNha: deposit.MaNha || "",
    MaPT: deposit.MaPT || "",
    TenKH: deposit.TenKH || "",
    SoDienThoai: deposit.SoDienThoai || "",
    SoTien: deposit.SoTien || "",
    NgayDatCoc: formatDateForInput(deposit.NgayDatCoc) || "",
    GhiChu: deposit.GhiChu || "",
    TrangThai: deposit.TrangThai || "Đang cọc",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "SoTien") {
      const cleanValue = value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
      const numericValue = cleanValue === "" ? "" : parseFloat(cleanValue); // Chuyển thành số
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.TenKH ||
      !formData.SoDienThoai ||
      !formData.SoTien ||
      !formData.NgayDatCoc ||
      !formData.TrangThai
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      const response = await updateDepositService({
        MaDC: deposit.MaDC,
        MaPT: deposit.MaPT,
        TenKH: formData.TenKH,
        SoDienThoai: formData.SoDienThoai,
        SoTien: formData.SoTien,
        NgayDatCoc: formData.NgayDatCoc,
        GhiChu: formData.GhiChu,
        TrangThai: formData.TrangThai,
      });

      if (response.EC === 0) {
        toast.success("Cập nhật đặt cọc thành công!");
        refetch();
        setOpen(false);
      } else {
        toast.error(response.EM || "Cập nhật đặt cọc thất bại!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi cập nhật đặt cọc!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded cursor-pointer border-none bg-transparent outline-none shadow-none"
          disabled={deposit.TrangThai === "Hoàn lại" || deposit.TrangThai === "Hoàn tất"}
        >
          <SquarePen className="size-4 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-3/5 rounded" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Cập nhật đặt cọc</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2 py-4">
            <div className="grid items-center gap-4">
              <Label htmlFor="TenKH" className="text-right">
                Tên khách
              </Label>
              <Input
                id="TenKH"
                name="TenKH"
                value={formData.TenKH}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
                required
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="SoDienThoai" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="SoDienThoai"
                name="SoDienThoai"
                value={formData.SoDienThoai}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
                required
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="SoTien" className="text-right">
                Số tiền
              </Label>
              <Input
                id="SoTien"
                name="SoTien"
                type="text"
                value={formatCurrency(formData.SoTien || 0)}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
                required
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="NgayDatCoc" className="text-right">
                Ngày đặt cọc
              </Label>
              <Input
                id="NgayDatCoc"
                name="NgayDatCoc"
                type="date"
                value={formData.NgayDatCoc}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
                required
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="TrangThai" className="text-right">
                Trạng thái
              </Label>
              <Select
                id="TrangThai"
                name="TrangThai"
                value={formData.TrangThai}
                onValueChange={(value) =>
                  handleChange({ target: { name: "TrangThai", value } })
                }
                className="col-span-3"
                required
              >
                <SelectTrigger className="w-full rounded shadow-none cursor-pointer">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent className="rounded">
                  <SelectItem value="Đang cọc">Đang cọc</SelectItem>
                  <SelectItem value="Hoàn lại">Hoàn lại</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mb-3">
            <div className="grid items-center gap-4">
              <Label htmlFor="GhiChu" className="text-right">
                Ghi chú
              </Label>
              <Textarea
                id="GhiChu"
                name="GhiChu"
                value={formData.GhiChu}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
            >
              Lưu
            </Button>
            <Button
              type="button"
              className="rounded cursor-pointer"
              variant="destructive"
              onClick={() => setOpen(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateDeposit;
