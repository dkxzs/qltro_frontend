import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateServiceService } from "@/services/serviceServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { SquarePen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateService = ({ dataUpdate, refetch }) => {
  const [formData, setFormData] = useState({
    TenDV: "",
    DonGia: "",
    DonViTinh: "",
    BatBuoc: false,
    Code: "",
    CachTinhPhi: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dataUpdate && open) {
      const newFormData = {
        TenDV: dataUpdate.TenDV || "",
        DonGia: dataUpdate.DonGia
          ? dataUpdate.DonGia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          : "",
        DonViTinh: dataUpdate.DonViTinh || "",
        BatBuoc: dataUpdate.BatBuoc || false,
        Code: dataUpdate.Code || "",
        CachTinhPhi: dataUpdate.CachTinhPhi || "",
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
    }
  }, [dataUpdate, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "DonGia") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCachTinhPhiChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      CachTinhPhi: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      TenDV: "",
      DonGia: "",
      DonViTinh: "",
      BatBuoc: false,
      Code: "",
      CachTinhPhi: "",
    });
    setInitialFormData(null);
  };

  const mutationUpdateService = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateServiceService(id, data);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi cập nhật dịch vụ");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      resetForm();
      setTimeout(() => setOpen(false), 300);
      refetch();
    },
    onError: (error) => {
      console.error("Update service error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Cập nhật dịch vụ thất bại: Có dữ liệu liên quan không hợp lệ."
        : error.message.includes("duplicate")
        ? "Tên dịch vụ đã tồn tại. Vui lòng chọn tên khác."
        : error.message || "Đã có lỗi xảy ra khi cập nhật dịch vụ";
      toast.error(errorMessage);
    },
  });

  const validateForm = () => {
    if (!formData.TenDV.trim()) {
      toast.error("Tên dịch vụ không được để trống");
      return false;
    }

    const donGiaValue = formData.DonGia.replace(/\./g, "");
    if (!donGiaValue) {
      toast.error("Đơn giá không được để trống");
      return false;
    }

    if (isNaN(donGiaValue) || parseInt(donGiaValue) <= 0) {
      toast.error("Đơn giá phải là số dương");
      return false;
    }

    if (!formData.DonViTinh.trim()) {
      toast.error("Đơn vị tính không được để trống");
      return false;
    }

    if (!formData.CachTinhPhi) {
      toast.error("Cách tính phí phải được chọn");
      return false;
    }

    return true;
  };

  const isFormDataChanged = () => {
    if (!initialFormData) return true;
    return (
      formData.TenDV !== initialFormData.TenDV ||
      formData.DonGia !== initialFormData.DonGia ||
      formData.DonViTinh !== initialFormData.DonViTinh ||
      formData.BatBuoc !== initialFormData.BatBuoc ||
      formData.Code !== initialFormData.Code ||
      formData.CachTinhPhi !== initialFormData.CachTinhPhi
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormDataChanged()) {
      toast.info("Không có thay đổi để cập nhật");
      return;
    }
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        DonGia: parseInt(formData.DonGia.replace(/\./g, "")),
        Code: formData.Code.trim() || null,
      };
      mutationUpdateService.mutate({
        id: dataUpdate.MaDV,
        data: dataToSubmit,
      });
    }
  };

  const handleClose = () => {
    if (
      isFormDataChanged() &&
      !window.confirm("Bạn có chắc muốn đóng? Dữ liệu chưa lưu sẽ mất.")
    ) {
      return;
    }
    setOpen(false);
    resetForm();
  };

  const isFormDisabled = mutationUpdateService.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Cập nhật dịch vụ"
        >
          <SquarePen className="size-4 text-blue-700" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật dịch vụ</DialogTitle>
          <DialogDescription>
            Vui lòng cập nhật thông tin dịch vụ.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="tendichvu">Tên dịch vụ</Label>
              <Input
                type="text"
                id="tendichvu"
                name="TenDV"
                placeholder="Điện, Nước, Internet, ..."
                className="rounded mt-2 shadow-none"
                value={formData.TenDV}
                onChange={handleChange}
                disabled={isFormDisabled}
                aria-label="Tên dịch vụ"
              />
            </div>
            <div>
              <Label htmlFor="dongia">Đơn giá (VNĐ)</Label>
              <Input
                type="text"
                id="dongia"
                name="DonGia"
                placeholder="3.000"
                className="rounded mt-2 shadow-none"
                value={formData.DonGia}
                onChange={handleChange}
                disabled={isFormDisabled}
                aria-label="Đơn giá dịch vụ"
              />
            </div>
            <div>
              <Label htmlFor="donvitinh">Đơn vị tính</Label>
              <Input
                type="text"
                id="donvitinh"
                name="DonViTinh"
                placeholder="kWh, m³, tháng, ..."
                className="rounded mt-2 shadow-none"
                value={formData.DonViTinh}
                onChange={handleChange}
                disabled={isFormDisabled}
                aria-label="Đơn vị tính"
              />
            </div>
            <div>
              <Label htmlFor="code">Mã dịch vụ</Label>
              <Input
                type="text"
                id="code"
                name="Code"
                placeholder="DV001, ..."
                className="rounded mt-2 shadow-none"
                value={formData.Code}
                onChange={handleChange}
                disabled={isFormDisabled}
                aria-label="Mã dịch vụ"
              />
            </div>
            <div>
              <Label htmlFor="cachtinhphi">Cách tính phí</Label>
              <Select
                value={formData.CachTinhPhi}
                onValueChange={handleCachTinhPhiChange}
                disabled={isFormDisabled}
              >
                <SelectTrigger
                  id="cachtinhphi"
                  className="rounded mt-2 shadow-none w-full cursor-pointer"
                  aria-label="Cách tính phí"
                >
                  <SelectValue placeholder="Chọn cách tính phí" />
                </SelectTrigger>
                <SelectContent className="rounded">
                  <SelectItem className="cursor-pointer" value="CHI_SO">
                    Tính theo chỉ số
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="SO_LUONG">
                    Tính theo số lượng
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="CO_DINH">
                    Tính theo tháng
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="batbuoc"
                name="BatBuoc"
                checked={formData.BatBuoc}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, BatBuoc: checked }))
                }
                disabled={isFormDisabled}
                aria-label="Dịch vụ bắt buộc"
                className="rounded-xs shadow-none cursor-pointer"
              />
              <Label htmlFor="batbuoc" className="cursor-pointer">
                Dịch vụ bắt buộc
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              disabled={isFormDisabled}
              aria-label="Cập nhật dịch vụ"
            >
              {mutationUpdateService.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Lưu"
              )}
            </Button>
            <Button
              type="button"
              className="rounded cursor-pointer"
              onClick={handleClose}
              disabled={isFormDisabled}
              variant="destructive"
              aria-label="Hủy cập nhật dịch vụ"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateService;
