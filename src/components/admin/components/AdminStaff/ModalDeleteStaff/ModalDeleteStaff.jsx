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
  deleteStaffService,
  checkStaffHasAssignmentService,
} from "@/services/staffServices";
import { useMutation } from "@tanstack/react-query";
import { Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ModalDeleteStaff = ({ dataDelete, refetch }) => {
  const [open, setOpen] = useState(false);
  const [hasAssignment, setHasAssignment] = useState(false);

  useEffect(() => {
    if (open && dataDelete?.MaNV) {
      checkStaffHasAssignmentService(dataDelete.MaNV)
        .then((res) => {
          if (res.EC === 0) setHasAssignment(res.DT);
        })
        .catch((error) => {
          console.error("Error checking assignment:", error);
          toast.error("Không thể kiểm tra trạng thái phân công.");
        });
    }
  }, [open, dataDelete?.MaNV]);

  const mutationDeleteEmployee = useMutation({
    mutationFn: ({ id }) => deleteStaffService(id),
    onSuccess: (data) => {
      toast.success(data.EM);
      setTimeout(() => setOpen(false), 300);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra khi xóa nhân viên");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasAssignment) {
      toast.error("Không thể xóa nhân viên đang được phân công");
      return;
    }
    mutationDeleteEmployee.mutate({ id: dataDelete?.MaNV });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isFormDisabled = mutationDeleteEmployee.isPending || hasAssignment;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-transparent  shadow-none outline-none cursor-pointer">
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded">
        <DialogHeader>
          <DialogTitle>Xóa nhân viên</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa nhân viên "{dataDelete?.HoTen}"?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            {hasAssignment && (
              <p className="text-red-500 font-medium mt-2">
                Không thể xóa vì nhân viên này đang được phân công.
              </p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="bg-blue-600 text-white cursor-pointer rounded shadow-none"
              disabled={isFormDisabled}
            >
              {mutationDeleteEmployee.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                "Xóa"
              )}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleClose}
              disabled={mutationDeleteEmployee.isPending}
              className="rounded shadow-none cursor-pointer"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteStaff;
