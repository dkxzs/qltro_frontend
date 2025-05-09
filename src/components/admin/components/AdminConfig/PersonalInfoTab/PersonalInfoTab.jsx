import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPersonalInfo } from "@/redux/slices/inforSlice.js";
import { toast } from "react-toastify";

const PersonalInfoTab = () => {
  const dispatch = useDispatch();
  const personalInfoState = useSelector(
    (state) => state.inforConfig.personalInfo
  );

  const [personalInfo, setPersonalInfoLocal] = useState({
    HoTen: "",
    CCCD: "",
    NgayCap: "",
    NoiCap: "",
    NgaySinh: "",
    DienThoai: "",
    DiaChi: "",
  });

  useEffect(() => {
    if (personalInfoState) {
      setPersonalInfoLocal({
        HoTen: personalInfoState.HoTen || "",
        CCCD: personalInfoState.CCCD || "",
        NgayCap: personalInfoState.NgayCap || "",
        NoiCap: personalInfoState.NoiCap || "",
        NgaySinh: personalInfoState.NgaySinh || "",
        DienThoai: personalInfoState.DienThoai || "",
        DiaChi: personalInfoState.DiaChi || "",
      });
    }
  }, [personalInfoState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfoLocal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!personalInfo.HoTen.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return false;
    }

    if (personalInfo.CCCD && !/^\d{12}$/.test(personalInfo.CCCD)) {
      toast.error("Số CCCD phải có 12 chữ số");
      return false;
    }

    if (personalInfo.DienThoai && !/^\d{10}$/.test(personalInfo.DienThoai)) {
      toast.error("Số điện thoại phải có 10 chữ số");
      return false;
    }

    return true;
  };

  const handleSaveChanges = () => {
    if (validateForm()) {
      dispatch(setPersonalInfo(personalInfo));
      toast.success("Đã lưu thông tin cá nhân thành công");
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            name="HoTen"
            placeholder="Nhập họ và tên"
            value={personalInfo.HoTen}
            onChange={handleChange}
            className="rounded shadow-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cccd">Số CCCD</Label>
          <Input
            id="cccd"
            name="CCCD"
            placeholder="Nhập số CCCD"
            value={personalInfo.CCCD}
            onChange={handleChange}
            className="rounded shadow-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issueDate">Ngày cấp</Label>
          <Input
            id="issueDate"
            name="NgayCap"
            type="date"
            placeholder="Chọn ngày cấp"
            value={personalInfo.NgayCap}
            onChange={handleChange}
            className="rounded shadow-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuePlace">Nơi cấp</Label>
          <Input
            id="issuePlace"
            name="NoiCap"
            placeholder="Nhập nơi cấp"
            value={personalInfo.NoiCap}
            onChange={handleChange}
            className="rounded shadow-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Ngày sinh</Label>
          <Input
            id="birthDate"
            name="NgaySinh"
            type="date"
            placeholder="Chọn ngày sinh"
            value={personalInfo.NgaySinh}
            onChange={handleChange}
            className="rounded shadow-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            id="phoneNumber"
            name="DienThoai"
            placeholder="Nhập số điện thoại"
            value={personalInfo.DienThoai}
            onChange={handleChange}
            className="rounded shadow-none"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            name="DiaChi"
            placeholder="Nhập địa chỉ"
            value={personalInfo.DiaChi}
            onChange={handleChange}
            className="rounded shadow-none"
          />
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

export default PersonalInfoTab;
