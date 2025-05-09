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
import { deleteCustomerService } from "@/services/customerServices";
import { useMutation } from "@tanstack/react-query";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteCustomer = ({ dataDelete, refetch }) => {
  const [open, setOpen] = useState(false);

  const mutationDeleteCustomer = useMutation({
    mutationFn: async ({ id }) => {
      const res = await deleteCustomerService(id);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi xóa khách trọ");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      setTimeout(() => setOpen(false), 300); // Độ trễ để toast hiển thị
      refetch();
    },
    onError: (error) => {
      console.error("Delete customer error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Xóa khách trọ thất bại: Khách trọ đang có hợp đồng thuê hoặc dữ liệu liên quan (hóa đơn, v.v.). Vui lòng kiểm tra lại."
        : error.message || "Đã có lỗi xảy ra khi xóa khách trọ";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutationDeleteCustomer.mutate({ id: dataDelete?.MaKH });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isFormDisabled = mutationDeleteCustomer.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Xóa khách trọ"
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
          <DialogTitle>Xóa khách trọ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <p className="text-base">
              Bạn có chắc chắn muốn xóa khách trọ{" "}
              <span className="font-semibold">"{dataDelete?.HoTen}"</span>?
            </p>
            <p className="text-red-500 mt-2 text-sm">
              Lưu ý: Hành động này không thể hoàn tác. Khách trọ đang có hợp
              đồng thuê phòng sẽ không thể xóa.
            </p>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600  text-white"
              disabled={isFormDisabled}
              aria-label="Xóa khách trọ"
            >
              {mutationDeleteCustomer.isPending ? (
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
              aria-label="Hủy xóa khách trọ"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteCustomer;
