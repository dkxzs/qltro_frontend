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
import { deleteCustomerService } from "@/services/customerServices";
import { useMutation } from "@tanstack/react-query";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalDeleteCustomer = (props) => {
  const { dataDelete, refetch } = props;
  const [open, setOpen] = useState(false);

  const mutationDeleteCustomer = useMutation({
    mutationFn: async ({ id }) => {
      const res = await deleteCustomerService(id);
      return res;
    },
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM);
        refetch();
        setOpen(!open);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.EM || "Đã có lỗi xảy ra");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutationDeleteCustomer.mutate({ id: dataDelete?.MaKH });
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
          <Trash2 className="h-4 w-4 " />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-2/5 rounded"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Xoá khách trọ</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="w-full">
          <h2>Bạn có muốn xóa {dataDelete.HoTen} khỏi hệ thống không?</h2>
        </div>

        <DialogFooter>
          <Button
            type="submit"
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

export default ModalDeleteCustomer;
