import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteIssueService } from "@/services/issueService";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteIssue = ({ dataDelete, refetch }) => {
  const [open, setOpen] = useState(false);
  console.log("dataDelete", dataDelete);
  const mutationDeleteHouse = useMutation({
    mutationFn: async ({ id }) => {
      const res = await deleteIssueService(id);
      if (res.EC !== 0) {
        return { error: true, EC: res.EC, EM: res.EM };
      }
      return res;
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.EM || "Lỗi không xác định từ server");
      } else {
        toast.success(data.EM || "Xóa sự cố thành công");
        setTimeout(() => setOpen(false), 300);
        refetch();
      }
    },
    onError: () => {
      toast.error("Có lỗi, vui lòng thử lại.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    mutationDeleteHouse.mutate({ id: dataDelete?.MaSC });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isFormDisabled = mutationDeleteHouse.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-transparent border-none rounded-none shadow-none outline-none cursor-pointer text-white"
          aria-label="Xóa sự cố"
        >
          <Trash2 className="size-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md rounded transition-all duration-300 ease-in-out"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Xóa sự cố</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <p className="text-base">Bạn có chắc chắn muốn xóa sự cố </p>
            <p className="text-red-500 mt-2 text-sm">
              Lưu ý: Hành động này không thể hoàn tác.
            </p>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600 text-white"
              disabled={isFormDisabled}
              aria-label="Xóa nhà"
            >
              {mutationDeleteHouse.isPending ? (
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
              disabled={mutationDeleteHouse.isPending}
              variant="destructive"
              aria-label="Hủy xóa nhà"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteIssue;
