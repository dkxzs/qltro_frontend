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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateIssueService } from "@/services/issueService";
import { useMutation } from "@tanstack/react-query";
import { Loader2, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateIssue = ({ dataUpdate, refetch, refetchStatus }) => {
  const [formData, setFormData] = useState({
    MaPT: "",
    MoTa: "",
    TrangThai: 0,
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dataUpdate && open) {
      const newFormData = {
        MaPT: dataUpdate.MaPT || "",
        MoTa: dataUpdate.MoTa || "",
        TrangThai: dataUpdate.TrangThai || 0,
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
    }
  }, [dataUpdate, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const resetForm = () => {
    setFormData({
      MoTa: "",
      TrangThai: 0,
    });
    setInitialFormData(null);
  };

  const mutationUpdateReport = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateIssueService(id, data);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi cập nhật báo cáo sự cố");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      resetForm();
      setTimeout(() => setOpen(false), 300);
      refetchStatus();
      refetch();
    },
    onError: (error) => {
      console.error("Update report error:", error);
      const errorMessage =
        error.message || "Đã có lỗi xảy ra khi cập nhật báo cáo sự cố";
      toast.error(errorMessage);
    },
  });

  const validateForm = () => {
    if (!formData.MoTa.trim()) {
      toast.error("Mô tả không được để trống");
      return false;
    }
    return true;
  };

  const isFormDataChanged = () => {
    if (!initialFormData) return true;
    return (
      formData.MoTa !== initialFormData.MoTa ||
      formData.TrangThai !== initialFormData.TrangThai
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormDataChanged()) {
      toast.info("Không có thay đổi để cập nhật");
      return;
    }
    if (validateForm()) {
      mutationUpdateReport.mutate({
        id: dataUpdate.MaSC,
        data: formData,
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

  const isFormDisabled = mutationUpdateReport.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Cập nhật báo cáo sự cố"
        >
          <SquarePen className="size-4 text-blue-700" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 max-w-2xl rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật báo cáo sự cố</DialogTitle>
          <DialogDescription>
            Vui lòng cập nhật thông tin báo cáo sự cố.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="w-full">
              <Label htmlFor="mota">Mô tả</Label>
              <Textarea
                id="mota"
                name="MoTa"
                placeholder="Mô tả chi tiết về sự cố"
                className="rounded mt-2 min-h-[100px] shadow-none"
                value={formData.MoTa}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="trangthai">Trạng thái</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("TrangThai", parseInt(value))
                }
                className="rounded mt-2 shadow-none cursor-pointer"
                value={formData.TrangThai.toString()}
                disabled={isFormDisabled}
              >
                <SelectTrigger className="rounded mt-2 shadow-none cursor-pointer w-1/2">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent className="rounded shadow-none">
                  <SelectItem className="cursor-pointer" value="0">
                    Đang xử lý
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="1">
                    Hoàn thành
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              disabled={isFormDisabled}
              aria-label="Cập nhật báo cáo sự cố"
            >
              {mutationUpdateReport.isPending ? (
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
              aria-label="Hủy cập nhật báo cáo sự cố"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateIssue;
