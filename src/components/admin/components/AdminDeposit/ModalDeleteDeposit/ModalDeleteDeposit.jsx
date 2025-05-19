import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteDepositService } from "@/services/depositServices";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteDeposit = ({ deposit, refetch }) => {
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await deleteDepositService(deposit.MaDC);
      return response;
    },
    onSuccess: () => {
      toast.success("Xóa đặt cọc thành công!");
      refetch();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className=" text-white cursor-pointer outline-none bg-transparent border-none shadow-none"
          disabled={deposit.TrangThai === "Hoàn tất"}
        >
          <Trash2 className="size-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-2/5 rounded">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Bạn có chắc muốn xóa đặt cọc phòng{" "}
            <strong>{deposit.PhongTro.TenPhong}</strong>?
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={handleDelete}
            className="bg-blue-600 rounded cursor-pointer"
          >
            Xóa
          </Button>
          <Button
            variant="destructive"
            onClick={() => setOpen(false)}
            className=" text-white rounded cursor-pointer"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteDeposit;
