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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignIn } from "@/services/authServices";
import { useMutation } from "@tanstack/react-query";
import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [open, setOpen] = useState(false);

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
      toast.success(data.EM);
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

  const handleClose = () => {
    const hasUnsavedChanges = formData.username || formData.password;
    if (
      hasUnsavedChanges &&
      !window.confirm("Bạn có chắc muốn đóng? Dữ liệu chưa lưu sẽ mất.")
    ) {
      return;
    }
    setOpen(false);
    resetForm();
  };

  const isFormDisabled = mutationLogin.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-transparent shadow-none text-black hover:bg-blue-500 hover:text-white px-4 py-2 font-semibold border-2 rounded cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200 flex items-center">
          <LogIn className="w-4 h-4" />
          <span>Đăng nhập</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 max-w-md rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Đăng nhập</DialogTitle>
          <DialogDescription>
            Vui lòng nhập tài khoản và mật khẩu để đăng nhập.
          </DialogDescription>
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
                className="rounded mt-2 shadow-none"
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
                className="rounded mt-2 shadow-none"
                value={formData.password}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
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
            <Button
              type="button"
              className="rounded cursor-pointer"
              onClick={handleClose}
              disabled={isFormDisabled}
              variant="destructive"
              aria-label="Hủy đăng nhập"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalLogin;
