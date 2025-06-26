import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminService, updateAdminService } from "@/services/adminServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EmailConfigTab = () => {
  const [emailConfig, setEmailConfigLocal] = useState({
    systemEmail: "",
    systemPassword: "",
    personalEmail: "",
  });

  const { data: adminData } = useQuery({
    queryKey: ["emailConfig"],
    queryFn: () => getAdminService(),
  });

  useEffect(() => {
    setEmailConfigLocal({
      systemEmail: adminData?.DT.SystemEmail || "",
      systemPassword: "",
      personalEmail: adminData?.DT.PersonalEmail || "",
    });
  }, [adminData]);

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailConfigLocal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const emailMutation = useMutation({
    mutationFn: async (data) => {
      const secretKey = import.meta.env.VITE_ENCRYPTION_SECRET || "sudodev";
      const encryptedPassword = data.systemPassword
        ? CryptoJS.AES.encrypt(data.systemPassword, secretKey).toString()
        : undefined;

      const payload = {
        ...data,
        systemPassword: encryptedPassword,
      };
      return updateAdminService(payload);
    },
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM);
      } else {
        toast.error(data.EM);
      }
    },
    onError: (err) => {
      console.log("Error in email mutation:", err);
      toast.error("Có lỗi xảy ra");
    },
  });

  const handleSaveChanges = () => {
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

    if (emailConfig.systemPassword && emailConfig.systemPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    emailMutation.mutate(emailConfig);
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
          <Label htmlFor="systemPassword">Mật khẩu</Label>
          <Input
            id="systemPassword"
            name="systemPassword"
            type="password"
            placeholder="Nhập mật khẩu email hệ thống"
            value={emailConfig.systemPassword}
            onChange={handleEmailChange}
            className="rounded shadow-none"
          />
          <p className="text-xs text-gray-500">
            Mật khẩu của email hệ thống (sẽ được mã hóa khi lưu)
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
        <Button
          className="rounded cursor-pointer bg-blue-600"
          onClick={handleSaveChanges}
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default EmailConfigTab;
