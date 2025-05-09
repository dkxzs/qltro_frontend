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
      toast.error("Không tìm thấy thông tin chi phí phát sinh!");
      return;
    }

    mutationDeleteExpense.mutate(dataDelete.MaCPPS);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          disabled={disabled}
          aria-label="Mở modal xóa chi phí phát sinh"
        >
          <Trash2 className="size-5 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-white shadow-md rounded max-w-md"
        aria-describedby="delete-expense-description"
      >
        <DialogHeader>
          <DialogTitle>Xóa chi phí phát sinh</DialogTitle>
          <DialogDescription id="delete-expense-description">
            Bạn có chắc chắn muốn xóa chi phí phát sinh này không? Hành động này
            không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2 bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Mô tả:</span>{" "}
              {dataDelete?.MoTa || "Không có mô tả"}
            </p>
            <p className="text-sm text-gray-700">
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
        <DialogFooter className="mt-4">
          <Button
            onClick={handleDelete}
            className="text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 "
            disabled={mutationDeleteExpense.isPending}
            aria-label="Xác nhận xóa chi phí phát sinh"
          >
            {mutationDeleteExpense.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Xoá"
            )}
          </Button>
          <Button
            onClick={() => setOpen(false)}
            className="text-white rounded cursor-pointer"
            variant="destructive"
            aria-label="Hủy xóa chi phí"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteExpense;
