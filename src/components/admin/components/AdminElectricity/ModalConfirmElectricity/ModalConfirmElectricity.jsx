import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ModalConfirmElectricity = ({
  open,
  onOpenChange,
  pendingSave,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded w-3/5">
        <DialogHeader>
          <DialogTitle>Xác nhận lưu chỉ số điện</DialogTitle>
          <DialogDescription>
            Bạn đang lưu chỉ số điện cho phòng{" "}
            <strong>{pendingSave?.roomName}</strong> thuộc nhà{" "}
            <strong>{pendingSave?.houseName}</strong>.
            <br />
            <br />
            <span className="text-red-500 font-semibold">
              Lưu ý quan trọng:
            </span>{" "}
            Vui lòng kiểm tra lại thông tin trước khi lưu. Nếu hoá đơn được tạo
            thì sẽ không thể thay đổi chỉ số mới được
            <br />
            <br />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <span className="font-medium">Chỉ số cũ:</span>{" "}
                {pendingSave?.data?.ChiSoCu}
              </div>
              <div>
                <span className="font-medium">Chỉ số mới:</span>{" "}
                {pendingSave?.data?.ChiSoMoi}
              </div>
              <div>
                <span className="font-medium">Tiêu thụ:</span>{" "}
                {pendingSave?.data?.ChiSoMoi - pendingSave?.data?.ChiSoCu}
              </div>
              <div>
                <span className="font-medium">Tháng/Năm:</span>{" "}
                {pendingSave?.data?.Thang}/{pendingSave?.data?.Nam}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded cursor-pointer"
          >
            Hủy
          </Button>
          <Button onClick={onConfirm} className="rounded cursor-pointer">
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmElectricity;
