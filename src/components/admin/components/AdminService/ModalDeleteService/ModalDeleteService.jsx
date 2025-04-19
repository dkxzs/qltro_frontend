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
import { deleteServiceService, checkServiceInUseService } from "@/services/serviceServices";
import { useMutation } from "@tanstack/react-query";

import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ModalDeleteService = (props) => {
  const { dataDelete, refetch } = props;
  const [open, setOpen] = useState(false);
  const [isInUse, setIsInUse] = useState(false);

  useEffect(() => {
    if (open && dataDelete?.MaDV) {
      const checkInUse = async () => {
        try {
          const res = await checkServiceInUseService(dataDelete.MaDV);
          if (res?.EC === 0) {
            setIsInUse(res.DT);
          }
        } catch (error) {
          console.error("Error checking service usage:", error);
        }
      };
      checkInUse();
    }
  }, [open, dataDelete?.MaDV]);

  const mutationDeleteService = useMutation({
    mutationFn: async ({ id }) => {
      const res = await deleteServiceService(id);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi xóa dịch vụ");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM || "Xóa dịch vụ thành công");
      refetch();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isInUse) {
      toast.error("Không thể xóa dịch vụ đang được sử dụng trong hợp đồng thuê");
      return;
    }
    
    mutationDeleteService.mutate({ id: dataDelete?.MaDV });
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
          <DialogTitle>Xóa dịch vụ</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa dịch vụ này không?
          </DialogDescription>
        </DialogHeader>
        
        {isInUse && (
          <div className="text-red-500 font-medium">
            Không thể xóa dịch vụ này vì đang được sử dụng trong hợp đồng thuê.
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
            disabled={isInUse || mutationDeleteService.isPending}
            className="bg-red-500 hover:bg-red-600 cursor-pointer rounded text-white"
            onClick={handleSubmit}
          >
            {mutationDeleteService.isPending ? "Đang xử lý..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteService;
