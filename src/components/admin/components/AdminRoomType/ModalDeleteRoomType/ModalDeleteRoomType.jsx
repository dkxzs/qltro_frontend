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
import { deleteRoomTypeService } from "@/services/roomTypeServices";
import { useMutation } from "@tanstack/react-query";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteRoomType = ({ dataDelete, refetch }) => {
  const [open, setOpen] = useState(false);

  const mutationDeleteRoomType = useMutation({
    mutationFn: async ({ id }) => {
      const res = await deleteRoomTypeService(id);
      if (res.EC !== 0) {
        return { error: true, EC: res.EC, EM: res.EM };
      }
      return res;
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.EM || "Lỗi không xác định từ server");
      } else {
        toast.success(data.EM || "Xóa loại phòng thành công");
        setTimeout(() => setOpen(false), 300);
        refetch();
      }
    },
    onError: () => {
      toast.error("Có lỗi, vui lòng thử lại.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutationDeleteRoomType.mutate({ id: dataDelete?.MaLP });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isFormDisabled = mutationDeleteRoomType.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className=" flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Xóa loại phòng"
        >
          <Trash2 className="size-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-2/5 max-w-md rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Xóa loại phòng</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <p className="text-base">
              Bạn có chắc chắn muốn xóa loại phòng{" "}
              <span className="font-semibold">
                "{dataDelete?.TenLoaiPhong}"
              </span>
              ?
            </p>
            <p className="text-red-500 mt-2 text-sm">
              Lưu ý: Hành động này không thể hoàn tác. Vui lòng đảm bảo loại
              phòng không còn được sử dụng.
            </p>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              disabled={isFormDisabled}
              aria-label="Xóa loại phòng"
            >
              {mutationDeleteRoomType.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin " />
                  Đang xử lý...
                </>
              ) : (
                "Xóa"
              )}
            </Button>
            <Button
              type="button"
              className="mr-2 rounded cursor-pointer"
              onClick={handleClose}
              disabled={isFormDisabled}
              variant="destructive"
              aria-label="Hủy xóa loại phòng"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteRoomType;
