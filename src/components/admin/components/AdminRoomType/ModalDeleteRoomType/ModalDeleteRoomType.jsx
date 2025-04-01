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

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteRoomType = (props) => {
  const { dataDelete, refetch } = props;
  const [open, setOpen] = useState(false);

  const mutationDeleteRoomType = useMutation({
    mutationFn: async ({ id }) => {
      const res = await deleteRoomTypeService(id);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi xóa loại phòng");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      refetch();
      setOpen(!open);
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutationDeleteRoomType.mutate({ id: dataDelete?.MaLP });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="mr-2 flex items-center cursor-pointer bg-red-500 hover:bg-red-600 rounded text-white">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-2/5 rounded"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Xoá loại phòng</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="w-full">
          <h2>
            Bạn có muốn xóa loại phòng "{dataDelete?.TenLoaiPhong}" khỏi hệ
            thống không?
          </h2>
          <p className="text-red-500 mt-2">
            Lưu ý: Hành động này không thể hoàn tác.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="cursor-pointer rounded"
            onClick={() => {
              setOpen(!open);
            }}
          >
            Đóng
          </Button>
          <Button
            type="submit"
            className="cursor-pointer rounded"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Xoá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteRoomType;
