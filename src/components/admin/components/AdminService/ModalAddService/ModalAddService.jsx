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
import { createServiceService } from "@/services/serviceServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation } from "@tanstack/react-query";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalAddService = (props) => {
  const { refetch } = props;
  const [formData, setFormData] = useState({
    TenDV: "",
    DonGia: "",
    DonViTinh: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "DonGia" ? formatCurrency(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      TenDV: "",
      DonGia: "",
      DonViTinh: "",
    });
  };

  const mutationCreateService = useMutation({
    mutationFn: async (data) => {
      const res = await createServiceService(data);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi thêm dịch vụ");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      resetForm();
      setOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra");
    },
  });

  const validateForm = () => {
    const donGiaValue = formData.DonGia.replace(/\./g, "");

    if (!formData.TenDV.trim()) {
      toast.error("Tên dịch vụ không được để trống");
      return false;
    }

    if (!formData.DonGia.trim()) {
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

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        DonGia: parseInt(formData.DonGia.replace(/\./g, "")),
      };
      mutationCreateService.mutate(dataToSubmit);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="mr-2 flex items-center cursor-pointer bg-green-700 hover:bg-green-800 rounded">
          <Plus className="h-5 w-5 text-white" />
          Thêm dịch vụ
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 rounded"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ</DialogTitle>
          <DialogDescription>
            Vui lòng nhập đầy đủ thông tin để thêm dịch vụ mới.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tendichvu">Tên dịch vụ</Label>
              <Input
                type="text"
                id="tendichvu"
                name="TenDV"
                placeholder="Điện, Nước, Internet,..."
                className="rounded mt-2"
                value={formData.TenDV}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="dongia">Đơn giá (VNĐ)</Label>
              <Input
                type="text"
                id="dongia"
                name="DonGia"
                placeholder="3000"
                className="rounded mt-2"
                value={formData.DonGia}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="donvitinh">Đơn vị tính</Label>
              <Input
                type="text"
                id="donvitinh"
                name="DonViTinh"
                placeholder="kW/h"
                className="rounded mt-2"
                value={formData.DonViTinh}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            className="cursor-pointer rounded"
            onClick={() => {
              setOpen(!open);
            }}
          >
            Đóng
          </Button>
          <Button
            type="submit"
            className="cursor-pointer rounded"
            onClick={(e) => handleSubmit(e)}
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddService;
