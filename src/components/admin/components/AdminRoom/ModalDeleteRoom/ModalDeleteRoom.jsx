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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteRoom = ({ dataDelete, refetch }) => {
  const [open, setOpen] = useState(false);

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
      setOpen(false);
      if (refetch) refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra khi xóa phòng");
    },
  });

  const handleDelete = () => {
    mutationDeleteRoom.mutate({ id: dataDelete?.MaPT });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mr-2 flex items-center cursor-pointer bg-red-500 hover:bg-red-600 rounded text-white">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa phòng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa phòng "{dataDelete?.TenPhong}" không? Hành
            động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="mr-2 rounded cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={mutationDeleteRoom.isPending}
            className="rounded cursor-pointer"
          >
            {mutationDeleteRoom.isPending ? "Đang xử lý..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteRoom;
