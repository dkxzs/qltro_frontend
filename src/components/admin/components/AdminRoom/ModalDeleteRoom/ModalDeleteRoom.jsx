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
import { deleteRoomService } from "@/services/roomServices";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteRoom = ({ dataDelete, refetch }) => {
  const [open, setOpen] = useState(false);
  console.log("datadele ", dataDelete);

  const mutationDeleteRoom = useMutation({
    mutationFn: async ({ id }) => {
      const response = await deleteRoomService(id);
      if (response.EC !== 0) {
        throw new Error(response.EM || "Có lỗi xảy ra khi xóa phòng");
      }
      return response;
    },
    onSuccess: (data) => {
      toast.success(data.EM || "Xóa phòng thành công");
      setTimeout(() => setOpen(false), 300);
      if (refetch) refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra khi xóa phòng");
    },
  });

  const handleDelete = () => {
    mutationDeleteRoom.mutate({ id: dataDelete?.MaPT });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Xóa phòng"
        >
          <Trash2 className="size-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded transition-all duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle>Xoá phòng</DialogTitle>
          <DialogDescription className="font-semibold">
            Bạn có chắc chắn muốn xóa phòng{" "}
            <span className="font-bold">"{dataDelete?.TenPhong}"</span> không?
            Hành động này không thể hoàn tác.
            <p className="text-red-500 mt-2 text-sm">
              Lưu ý: Hành động này không thể hoàn tác.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button
            type="button"
            onClick={handleDelete}
            disabled={mutationDeleteRoom.isPending}
            className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
            aria-label="Xác nhận xóa phòng"
          >
            {mutationDeleteRoom.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xóa"
            )}
          </Button>
          <Button
            type="button"
            onClick={handleClose}
            className="rounded cursor-pointer"
            disabled={mutationDeleteRoom.isPending}
            variant="destructive"
            aria-label="Hủy xóa phòng"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteRoom;
