import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getHouseByAccountIdService } from "@/services/houseServices";
import { createIssueService } from "@/services/issueService";
import { getRoomByAccountIdService } from "@/services/roomServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ModalAddIssueClient = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({ MaPT: "", MoTa: "" });
  const token = useSelector((state) => state.account?.account?.accessToken);
  let decode = null;
  try {
    if (token) decode = jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  const { data: houseData, isLoading: houseLoading } = useQuery({
    queryKey: ["houseClient"],
    queryFn: () => getHouseByAccountIdService(decode?.MaTK),
    enabled: !!decode?.MaTK,
  });

  const { data: roomData, isLoading: roomLoading } = useQuery({
    queryKey: ["roomClient"],
    queryFn: () => getRoomByAccountIdService(decode?.MaTK),
    enabled: !!decode?.MaTK,
  });

  const currentDate = new Date();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      MaPT: roomData?.DT?.MaPT || "",
    }));
  }, [roomData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ MaPT: roomData?.DT?.MaPT || "", MoTa: "" });
  };

  const mutationCreateReport = useMutation({
    mutationFn: async ({ data }) => {
      const res = await createIssueService(data);
      if (res.EC !== 0) throw new Error(res.EM || "Lỗi khi thêm báo cáo sự cố");
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      resetForm();
      setTimeout(() => onOpenChange(false), 300);
    },
    onError: (error) => {
      console.error("Add report error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Thêm báo cáo thất bại: Phòng không hợp lệ"
        : error.message;
      toast.error(errorMessage);
    },
  });

  const validateForm = () => {
    if (!decode) return toast.error("Vui lòng đăng nhập"), false;
    if (!formData.MoTa.trim())
      return toast.error("Mô tả không được để trống"), false;
    if (!formData.MaPT) return toast.error("Phòng không được để trống"), false;
    if (!houseData?.DT && !roomData?.DT)
      return toast.error("Bạn không đang thuê nhà hoặc phòng"), false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        MaPT: formData.MaPT,
        MoTa: formData.MoTa,
        NgayBaoCao: currentDate.toISOString(),
      };
      mutationCreateReport.mutate({ data: dataToSubmit });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const isFormDisabled =
    mutationCreateReport.isPending || houseLoading || roomLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="w-3/5 max-w-2xl rounded-2xl transition-all duration-300 ease-in-out"
        aria-describedby={undefined}
      >
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="text-3xl font-semibold">
            Báo cáo sự cố
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Label className="font-semibold">Nhà:</Label>
                <span>
                  {houseLoading
                    ? "Đang tải..."
                    : houseData?.DT?.TenNha || "Chưa có nhà"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Label className="font-semibold">Phòng:</Label>
                <span>
                  {roomLoading
                    ? "Đang tải..."
                    : roomData?.DT?.TenPhong || "Chưa có phòng"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="font-semibold">Ngày báo cáo:</Label>
              <span>{currentDate.toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="w-full">
              <Label htmlFor="mota">Mô tả</Label>
              <Textarea
                id="mota"
                name="MoTa"
                placeholder="Mô tả chi tiết về sự cố"
                className="w-full rounded mt-2 min-h-[100px] shadow-none"
                value={formData.MoTa}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded-full cursor-pointer flex items-center gap-2 bg-blue-600 w-full py-6"
              disabled={isFormDisabled}
              aria-label="Thêm báo cáo sự cố mới"
            >
              {mutationCreateReport.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Gửi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddIssueClient;
