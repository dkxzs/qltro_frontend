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
import { deleteHouseService, checkHouseHasRentService } from "@/services/houseServices";
import { useMutation } from "@tanstack/react-query";

import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ModalDeleteHouse = (props) => {
  const { dataDelete, refetch } = props;
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
      refetch();
      setOpen(!open);
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra");
      // Thêm log để debug
      console.error("Delete house error:", error);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-600 cursor-pointer rounded text-white">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xóa nhà</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa nhà này không?
          </DialogDescription>
        </DialogHeader>
        
        {hasRent && (
          <div className="text-red-500 font-medium">
            Không thể xóa nhà này vì đang có phòng được thuê.
          </div>
        )}
        
        <DialogFooter>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="mr-2 cursor-pointer rounded"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={hasRent || mutationDeleteHouse.isPending}
            className="bg-red-500 hover:bg-red-600 cursor-pointer rounded text-white"
            onClick={handleSubmit}
          >
            {mutationDeleteHouse.isPending ? "Đang xử lý..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteHouse;
