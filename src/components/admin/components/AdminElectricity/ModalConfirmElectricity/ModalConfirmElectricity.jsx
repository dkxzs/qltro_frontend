import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const ModalConfirmElectricity = ({
  open,
  onOpenChange,
  pendingSave,
  onConfirm,
  isConfirming = false,
}) => {
  if (!pendingSave || !pendingSave.data) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-lg bg-white shadow-md max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận lưu chỉ số điện</DialogTitle>
            <DialogDescription>
              Không có dữ liệu để xác nhận. Vui lòng thử lại.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white rounded cursor-pointer"
              aria-label="Đóng dialog"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const consumption =
    pendingSave.data.ChiSoMoi >= pendingSave.data.ChiSoCu
      ? pendingSave.data.ChiSoMoi - pendingSave.data.ChiSoCu
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded bg-white shadow-md w-3/5"
        aria-describedby="confirm-electricity-description"
      >
        <DialogHeader>
          <DialogTitle>Xác nhận lưu chỉ số điện</DialogTitle>
          <DialogDescription id="confirm-electricity-description">
            Bạn đang lưu chỉ số điện cho phòng{" "}
            <strong>{pendingSave.roomName}</strong> thuộc nhà{" "}
            <strong>{pendingSave.houseName}</strong>.
            <br />
            <br />
            <span className="text-red-500 font-semibold">
              Lưu ý quan trọng:
            </span>{" "}
            Vui lòng kiểm tra lại thông tin trước khi lưu. Nếu hoá đơn được tạo
            thì sẽ không thể thay đổi chỉ số mới được.
            <br />
            <br />
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md text-gray-700">
              <div>
                <span className="font-medium">Chỉ số cũ:</span>{" "}
                {pendingSave.data.ChiSoCu}
              </div>
              <div>
                <span className="font-medium">Chỉ số mới:</span>{" "}
                {pendingSave.data.ChiSoMoi}
              </div>
              <div>
                <span className="font-medium">Tiêu thụ:</span> {consumption}
              </div>
              <div>
                <span className="font-medium">Tháng/Năm:</span>{" "}
                {pendingSave.data.Thang}/{pendingSave.data.Nam}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onConfirm}
            className="bg-blue-600 text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isConfirming}
            aria-label="Xác nhận lưu chỉ số điện"
          >
            {isConfirming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Xác nhận"
            )}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="text-white rounded cursor-pointer"
            aria-label="Hủy xác nhận"
            variant="destructive"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmElectricity;
