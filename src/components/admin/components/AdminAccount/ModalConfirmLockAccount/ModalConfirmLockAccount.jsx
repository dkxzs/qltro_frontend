import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { updateAccountStatusService } from "@/services/accountServices";

const ModalConfirmLockAccount = ({
  open,
  onOpenChange,
  account,
  onConfirm,
  refetch,
}) => {
  console.log("account", account);
  const mutationUpdateStatus = useMutation({
    mutationFn: async ({ MaTK, TrangThai }) => {
      const res = await updateAccountStatusService(MaTK, TrangThai);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi cập nhật trạng thái");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      onConfirm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật trạng thái thất bại");
    },
  });

  const handleConfirm = () => {
    mutationUpdateStatus.mutate({
      MaTK: account.MaTK,
      TrangThai: !account.TrangThai,
    });
  };

  const isFormDisabled = mutationUpdateStatus.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-3/5 max-w-md rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {account.TrangThai ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn {account.TrangThai ? "khóa" : "kích hoạt"} tài
            khoản <strong>{account.TenTK}</strong> không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            className={`rounded cursor-pointer flex items-center gap-2 bg-blue-600`}
            disabled={isFormDisabled}
            onClick={handleConfirm}
            aria-label={
              account.TrangThai ? "Khóa tài khoản" : "Kích hoạt tài khoản"
            }
          >
            {isFormDisabled ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận"
            )}
          </Button>
          <Button
            type="button"
            className="rounded cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={isFormDisabled}
            variant="destructive"
            aria-label="Hủy"
          >
            Huỷ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmLockAccount;
