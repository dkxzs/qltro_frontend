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
import { Textarea } from "@/components/ui/textarea";
import { createBuildingService } from "@/services/buildingServices";
import { useMutation } from "@tanstack/react-query";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalAddBuilding = (props) => {
  const { refetch } = props;
  const [formData, setFormData] = useState({
    TenNha: "",
    DiaChi: "",
    MoTa: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      TenNha: "",
      DiaChi: "",
      MoTa: "",
    });
  };

  const mutationCreateBuilding = useMutation({
    mutationFn: async (data) => {
      const res = await createBuildingService(data);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi thêm nhà");
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
    if (!formData.TenNha.trim()) {
      toast.error("Tên nhà không được để trống");
      return false;
    }

    if (!formData.DiaChi.trim()) {
      toast.error("Địa chỉ không được để trống");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutationCreateBuilding.mutate(formData);
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
          Thêm nhà
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 rounded"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Thêm nhà</DialogTitle>
          <DialogDescription>
            Vui lòng nhập đầy đủ thông tin để thêm nhà mới.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tennha">Tên nhà</Label>
              <Input
                type="text"
                id="tennha"
                name="TenNha"
                placeholder="Nhà A"
                className="rounded mt-2"
                value={formData.TenNha}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="diachi">Địa chỉ</Label>
              <Input
                type="text"
                id="diachi"
                name="DiaChi"
                placeholder="123 Đường ABC, Quận XYZ"
                className="rounded mt-2"
                value={formData.DiaChi}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="mota">Mô tả</Label>
              <Textarea
                id="mota"
                name="MoTa"
                placeholder="Mô tả chi tiết về nhà"
                className="rounded mt-2 min-h-[100px]"
                value={formData.MoTa}
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

export default ModalAddBuilding;
