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
import { deleteExpenseService } from "@/services/expenseServices";
import { useMutation } from "@tanstack/react-query";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteExpense = ({ dataDelete, refetch, disabled }) => {
  const [open, setOpen] = useState(false);

  const mutationDeleteExpense = useMutation({
    mutationFn: async (id) => {
      return await deleteExpenseService(id);
    },
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM);
        setOpen(false);
        if (refetch) refetch();
      } else {
        toast.error(data.EM);
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Đã xảy ra lỗi khi xóa chi phí phát sinh");
    },
  });

  const handleDelete = () => {
    if (!dataDelete || !dataDelete.MaCPPS) {
      toast.error("Không tìm thấy thông tin chi phí phát sinh");
      return;
    }

    mutationDeleteExpense.mutate(dataDelete.MaCPPS);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-red-500 hover:bg-red-600 rounded text-white"
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md rounded"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Xóa chi phí phát sinh</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa chi phí phát sinh này không? Hành động này
            không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              <span className="font-semibold">Thông tin chi phí:</span>{" "}
              {dataDelete?.MoTa || "Không có mô tả"}
            </p>
            <p className="text-sm font-medium">
              <span className="font-semibold">Tổng tiền:</span>{" "}
              {dataDelete?.TongTien
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(dataDelete.TongTien)
                : "0 VNĐ"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            className="mr-2 rounded cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            disabled={mutationDeleteExpense.isPending}
            className="rounded cursor-pointer text-white"
          >
            {mutationDeleteExpense.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận xóa"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteExpense;
