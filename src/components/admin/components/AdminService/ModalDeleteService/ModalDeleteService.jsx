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
import {
  deleteServiceService,
  checkServiceInUseService,
} from "@/services/serviceServices";
import { useMutation } from "@tanstack/react-query";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteService = ({ dataDelete, refetch }) => {
  const [open, setOpen] = useState(false);
  const [isInUse, setIsInUse] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const mutationDeleteService = useMutation({
    mutationFn: async ({ id }) => {
      const res = await deleteServiceService(id);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi xóa dịch vụ");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM || "Xóa dịch vụ thành công");
      setTimeout(() => setOpen(false), 300); // Độ trễ để toast hiển thị
      refetch();
    },
    onError: (error) => {
      console.error("Delete service error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Xóa dịch vụ thất bại: Dịch vụ đang được sử dụng trong hợp đồng thuê hoặc dữ liệu liên quan. Vui lòng kiểm tra lại."
        : error.message || "Đã có lỗi xảy ra khi xóa dịch vụ";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataDelete?.MaDV) {
      toast.error("Mã dịch vụ không hợp lệ. Vui lòng thử lại.");
      return;
    }

    if (!isChecked) {
      try {
        const res = await checkServiceInUseService(dataDelete.MaDV);
        if (res?.EC === 0) {
          setIsInUse(res.DT);
          setIsChecked(true);
        } else {
          toast.error(
            res.EM || "Không thể kiểm tra trạng thái sử dụng dịch vụ"
          );
          return;
        }
      } catch (error) {
        console.error("Error checking service usage:", error);
        toast.error(
          "Không thể kiểm tra trạng thái sử dụng dịch vụ. Vui lòng thử lại."
        );
        return;
      }
    }

    if (isInUse) {
      toast.error(
        "Không thể xóa dịch vụ đang được sử dụng trong hợp đồng thuê"
      );
      return;
    }

    mutationDeleteService.mutate({ id: dataDelete?.MaDV });
  };

  const handleClose = () => {
    setOpen(false);
    setIsInUse(false);
    setIsChecked(false);
  };

  const isFormDisabled = mutationDeleteService.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Xóa dịch vụ"
        >
          <Trash2 className="size-5 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Xóa dịch vụ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <p className="text-base">
              Bạn có chắc chắn muốn xóa dịch vụ{" "}
              <span className="font-semibold">"{dataDelete?.TenDV}"</span>?
            </p>
            <p className="text-red-500 mt-2 text-sm">
              Lưu ý: Hành động này không thể hoàn tác. Dịch vụ đang được sử dụng
              trong hợp đồng thuê sẽ không thể xóa.
            </p>
            {isInUse && (
              <p className="text-red-500 font-medium mt-2">
                Dịch vụ này hiện đang được sử dụng trong hợp đồng thuê và không
                thể xóa.
              </p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600  text-white"
              disabled={isFormDisabled || isInUse}
              aria-label="Xóa dịch vụ"
            >
              {mutationDeleteService.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xóa"
              )}
            </Button>
            <Button
              type="button"
              className="rounded cursor-pointer"
              onClick={handleClose}
              disabled={isFormDisabled}
              variant="destructive"
              aria-label="Hủy xóa dịch vụ"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteService;
