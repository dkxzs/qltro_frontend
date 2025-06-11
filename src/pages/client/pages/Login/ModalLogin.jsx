import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/redux/slices/accountSlice";
import { SignIn } from "@/services/authServices";
import { useMutation } from "@tanstack/react-query";
import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ForgotPasswordModal from "./auth/ModalForgotPassword";

const ModalLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
    });
  };

  const mutationLogin = useMutation({
    mutationFn: async ({ data }) => SignIn(data.username, data.password),
    onSuccess: (data) => {
      console.log("data", data);
      toast.success(data.EM);
      dispatch(login(data));
      resetForm();
      setTimeout(() => setOpen(false), 300);
    },
    onError: () => {
      toast.error("Tài khoản hoặc mật khẩu không đúng");
    },
  });

  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error("Tài khoản không được để trống");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Mật khẩu không được để trống");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutationLogin.mutate({ data: formData });
    }
  };

  const handleClose = (newOpen) => {
    if (!newOpen) {
      const hasUnsavedChanges = formData.username || formData.password;
      if (
        hasUnsavedChanges &&
        !window.confirm("Bạn có chắc muốn đóng? Dữ liệu chưa lưu sẽ mất.")
      ) {
        return;
      }
      resetForm();
    }
    setOpen(newOpen);
  };

  const handleForgotPasswordClick = () => {
    setOpen(false);
    setTimeout(() => setOpenForgotPassword(true), 0);
  };

  const isFormDisabled = mutationLogin.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={() => handleClose(!open)}>
        <DialogTrigger asChild>
          <Button
            className="bg-transparent shadow-none text-black hover:bg-blue-500 hover:text-white px-4 py-2 font-semibold border-2 rounded cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200 flex items-center"
            onClick={() => {
              setOpen(true);
            }}
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-3/5 max-w-md rounded-2xl transition-all duration-300 ease-in-out">
          <DialogHeader className="flex justify-center items-center">
            <DialogTitle className="text-4xl">Đăng nhập</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div className="w-full">
                <Label htmlFor="username">Tài khoản</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Nhập tài khoản"
                  className="rounded-3xl mt-2 shadow-none py-6"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  className="rounded-3xl mt-2 shadow-none py-6"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                />
              </div>
              <div className="w-full text-right">
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-500 hover:underline text-sm cursor-pointer"
                  onClick={handleForgotPasswordClick}
                >
                  Quên mật khẩu?
                </Button>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                type="submit"
                className="rounded-full h-12 cursor-pointer flex items-center gap-2 mt-3 bg-blue-600 hover:bg-blue-700 w-full"
                disabled={isFormDisabled}
                aria-label="Đăng nhập"
              >
                {mutationLogin.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ForgotPasswordModal
        open={openForgotPassword}
        onOpenChange={setOpenForgotPassword}
      />
    </>
  );
};

export default ModalLogin;
