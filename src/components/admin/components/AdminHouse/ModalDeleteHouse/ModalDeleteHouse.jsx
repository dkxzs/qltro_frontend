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
import {
  deleteHouseService,
  checkHouseHasRentService,
} from "@/services/houseServices";
import { useMutation } from "@tanstack/react-query";
import { Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ModalDeleteHouse = ({ dataDelete, refetch }) => {
  const [open, setOpen] = useState(false);
  const [hasRent, setHasRent] = useState(false);

  useEffect(() => {
    if (open && dataDelete?.MaNha) {
      const checkHasRent = async () => {
        try {
          const res = await checkHouseHasRentService(dataDelete.MaNha);
          if (res?.EC === 0) {
            setHasRent(res.DT);
          }
        } catch (error) {
          console.error("Error checking rent status:", error);
          toast.error(
            "Không thể kiểm tra trạng thái thuê nhà. Vui lòng thử lại."
          );
        }
      };
      checkHasRent();
    }
  }, [open, dataDelete?.MaNha]);

  const mutationDeleteHouse = useMutation({
    mutationFn: async ({ id }) => {
      const res = await deleteHouseService(id);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi xóa nhà");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      setTimeout(() => setOpen(false), 300); // Độ trễ để toast hiển thị
      refetch();
    },
    onError: (error) => {
      console.error("Delete house error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Xóa nhà thất bại: Nhà đang có phòng hoặc dữ liệu liên quan (hợp đồng, điện nước, v.v.). Vui lòng kiểm tra lại."
        : error.message || "Đã có lỗi xảy ra khi xóa nhà";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasRent) {
      toast.error("Không thể xóa nhà đang có phòng được thuê");
      return;
    }
    mutationDeleteHouse.mutate({ id: dataDelete?.MaNha });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isFormDisabled = mutationDeleteHouse.isPending || hasRent;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className=" bg-transparent border-none rounded-none shadow-none outline-none cursor-pointer text-white"
          aria-label="Xóa nhà"
        >
          <Trash2 className="size-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Xóa nhà</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <p className="text-base">
              Bạn có chắc chắn muốn xóa nhà{" "}
              <span className="font-semibold">"{dataDelete?.TenNha}"</span>?
            </p>
            <p className="text-red-500 mt-2 text-sm">
              Lưu ý: Hành động này không thể hoàn tác. Vui lòng đảm bảo nhà
              không có phòng đang được thuê.
            </p>
            {hasRent && (
              <p className="text-red-500 font-medium mt-2">
                Không thể xóa vì nhà này đang có phòng được thuê.
              </p>
            )}
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

export default ModalDeleteHouse;
