import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  confirmPasswordReset,
  requestPasswordReset,
} from "@/services/authServices";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalForgotPassword = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(1);
  const [tenTK, setTenTK] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const requestMutation = useMutation({
    mutationFn: async ({ tenTK }) => requestPasswordReset(tenTK),
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM);
        setStep(2);
      } else {
        toast.error(data.EM);
      }
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi gửi mã OTP");
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async ({ TenTK, otp, newPassword }) =>
      confirmPasswordReset(TenTK, otp, newPassword),
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM);
        setStep(1);
        setTenTK("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        onOpenChange(false);
      } else {
        toast.error(data.EM);
      }
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi đổi mật khẩu");
    },
  });

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!tenTK.trim()) {
      toast.error("Vui lòng nhập tên tài khoản");
      return;
    }
    requestMutation.mutate({ tenTK });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Vui lòng nhập mã OTP");
      return;
    }
    setStep(3); // Chuyển sang bước đổi mật khẩu
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    confirmMutation.mutate({ TenTK: tenTK, otp, newPassword });
  };

  const handleClose = (newOpen) => {
    if (!newOpen) {
      setStep(1);
      setTenTK("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg shadow-lg">
        <DialogHeader className="flex items-center">
          <DialogTitle className="text-2xl font-bold text-blue-700">
            Quên mật khẩu
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleRequestSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tenTK" className="text-gray-700">
                Tên tài khoản
              </Label>
              <Input
                id="tenTK"
                value={tenTK}
                onChange={(e) => setTenTK(e.target.value)}
                placeholder="Nhập tên tài khoản"
                className="rounded-3xl border-gray-300 focus:ring-blue-500 shadow-none py-6"
                disabled={requestMutation.isPending}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white w-full py-6 rounded-full cursor-pointer"
                disabled={requestMutation.isPending}
              >
                {requestMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Nhận mã OTP"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-700">
                Mã OTP
              </Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập mã OTP từ email"
                className="rounded-3xl border-gray-300 focus:ring-blue-500 shadow-none py-6"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer w-full py-6 rounded-full"
              >
                Xác nhận
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-700">
                Mật khẩu mới
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="rounded-3xl border-gray-300 focus:ring-blue-500 pr-10 py-6 shadow-none"
                  disabled={confirmMutation.isPending}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Xác nhận mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu mới"
                  className="rounded-3xl border-gray-300 shadow-none focus:ring-blue-500 pr-10 py-6"
                  disabled={confirmMutation.isPending}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer w-full py-6 rounded-full"
                disabled={confirmMutation.isPending}
              >
                {confirmMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đổi mật khẩu"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalForgotPassword;
