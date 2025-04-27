import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmailConfig } from "@/redux/slices/inforSlice";
import { toast } from "react-toastify";

const EmailConfigTab = () => {
  const dispatch = useDispatch();
  const emailState = useSelector((state) => state.inforConfig.email);

  const [emailConfig, setEmailConfigLocal] = useState({
    systemEmail: "",
    personalEmail: "",
  });

  useEffect(() => {
    setEmailConfigLocal({
      systemEmail: emailState?.systemEmail || "",
      personalEmail: emailState?.personalEmail || "",
    });
  }, [emailState]);

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailConfigLocal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailConfig.systemEmail && !emailRegex.test(emailConfig.systemEmail)) {
      toast.error("Email hệ thống không hợp lệ");
      return;
    }

    if (
      emailConfig.personalEmail &&
      !emailRegex.test(emailConfig.personalEmail)
    ) {
      toast.error("Email cá nhân không hợp lệ");
      return;
    }

    // Lưu vào Redux store
    dispatch(setEmailConfig(emailConfig));
    toast.success("Đã lưu cấu hình email thành công");
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="systemEmail">Email hệ thống</Label>
          <Input
            id="systemEmail"
            name="systemEmail"
            placeholder="Nhập email hệ thống"
            value={emailConfig.systemEmail}
            onChange={handleEmailChange}
            className="rounded shadow-none"
          />
          <p className="text-xs text-gray-500">
            Email dùng để gửi thông báo từ hệ thống
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="personalEmail">Email cá nhân</Label>
          <Input
            id="personalEmail"
            name="personalEmail"
            placeholder="Nhập email cá nhân"
            value={emailConfig.personalEmail}
            onChange={handleEmailChange}
            className="rounded shadow-none"
          />
          <p className="text-xs text-gray-500">
            Email nhận thông báo từ hệ thống
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="rounded cursor-pointer" onClick={handleSaveChanges}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default EmailConfigTab;
