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
import { Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteAsset = ({ dataDelete }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    // Giả lập xóa tài sản (do chưa có API)
    toast.success("Xóa tài sản thành công");
    setTimeout(() => setOpen(false), 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer outline-none rounded-none border-none shadow-none bg-transparent"
          aria-label="Xóa tài sản"
        >
          <Trash2 className="szie-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 max-w-md rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Xóa tài sản</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa tài sản{" "}
            <strong>{dataDelete.TenTS}</strong> không? Hành động này không thể
            hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            className="rounded cursor-pointer bg-blue-600"
            onClick={handleDelete}
            aria-label="Xóa tài sản"
          >
            Xóa
          </Button>
          <Button
            type="button"
            className="rounded cursor-pointer"
            onClick={() => setOpen(false)}
            variant="destructive"
            aria-label="Hủy xóa tài sản"
          >
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteAsset;
