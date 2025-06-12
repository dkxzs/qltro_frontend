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
import { Textarea } from "@/components/ui/textarea";
import { createMembersService } from "@/services/memberServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalAddMember = ({ room }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState([
    {
      TenTV: "",
      CCCD: "",
      NgaySinh: "",
      DienThoai: "",
      DiaChi: "",
      TrangThai: true,
    },
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setMembers((prev) => {
      const updatedMembers = [...prev];
      updatedMembers[index] = {
        ...updatedMembers[index],
        [name]: value,
      };
      return updatedMembers;
    });
  };

  const handleAddAnotherMember = () => {
    setMembers((prev) => [
      ...prev,
      {
        TenTV: "",
        CCCD: "",
        NgaySinh: "",
        DienThoai: "",
        DiaChi: "",
        TrangThai: true,
      },
    ]);
  };

  const handleRemoveMember = (index) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const createMembersMutation = useMutation({
    mutationFn: createMembersService,
    onSuccess: (data) => {
      toast.success(data.EM);
      setTimeout(() => setOpen(false), 300);
      setMembers([
        {
          TenTV: "",
          CCCD: "",
          NgaySinh: "",
          DienThoai: "",
          DiaChi: "",
          TrangThai: true,
        },
      ]);
      queryClient.invalidateQueries(["members"]);
    },
    onError: (error) => {
      console.error("Add member error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Thêm thành viên thất bại: Phòng không hợp lệ hoặc có dữ liệu liên quan (hợp đồng, điện nước, v.v.). Vui lòng kiểm tra lại."
        : error.message || "Có lỗi xảy ra khi thêm thành viên";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!room.MaTP) {
      toast.error("Phòng này hiện không có hợp đồng thuê còn hiệu lực!");
      return;
    }

    for (const member of members) {
      if (!member.TenTV || !member.CCCD) {
        toast.error("Vui lòng nhập đầy đủ Tên và CCCD cho tất cả thành viên!");
        return;
      }
    }

    const membersWithMaTP = members.map((member) => ({
      MaTP: room.MaTP,
      ...member,
    }));

    createMembersMutation.mutate(membersWithMaTP);
  };

  const handleClose = () => {
    const hasUnsavedChanges = members.some(
      (member) =>
        member.TenTV ||
        member.CCCD ||
        member.NgaySinh ||
        member.DienThoai ||
        member.DiaChi
    );
    if (
      hasUnsavedChanges &&
      !window.confirm("Bạn có chắc muốn đóng? Dữ liệu chưa lưu sẽ mất.")
    ) {
      return;
    }
    setOpen(false);
  };

  const isFormDisabled = createMembersMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer  bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Thêm thành viên mới"
        >
          <UserPlus className="size-4 text-green-600" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-4/5 max-w-4xl rounded max-h-[80vh] flex flex-col transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Thêm thành viên</DialogTitle>
          <DialogDescription className="-mt-1">
            Vui lòng nhập thông tin để thêm thành viên mới cho phòng{" "}
            {room.TenPhong}.
          </DialogDescription>
        </DialogHeader>
        <form
          className="w-full mt-3 flex-1 flex flex-col"
          onSubmit={handleSubmit}
        >
          <div
            className="scrollbar-hide flex-1"
            style={{
              maxHeight: "50vh",
              overflowY: "auto",
              borderRadius: "inherit",
            }}
          >
            {members.map((member, index) => (
              <div key={index} className="mb-6 relative">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-lg font-semibold">
                    Thành viên {index + 1}
                  </Label>
                  {members.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="p-1 rounded cursor-pointer"
                      disabled={isFormDisabled}
                      aria-label={`Xóa thành viên ${index + 1}`}
                      variant="primary"
                      size="sm"
                    >
                      <X className="size-4 text-red-600" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6 w-full">
                  <div className="w-full">
                    <Label htmlFor={`tenTV-${index}`}>Tên thành viên</Label>
                    <Input
                      id={`tenTV-${index}`}
                      name="TenTV"
                      value={member.TenTV}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full rounded mt-2 shadow-none"
                      disabled={isFormDisabled}
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor={`cccd-${index}`}>Số CCCD</Label>
                    <Input
                      id={`cccd-${index}`}
                      name="CCCD"
                      value={member.CCCD}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full rounded mt-2 shadow-none"
                      disabled={isFormDisabled}
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor={`ngaySinh-${index}`}>Ngày sinh</Label>
                    <Input
                      id={`ngaySinh-${index}`}
                      name="NgaySinh"
                      type="date"
                      value={member.NgaySinh}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full rounded mt-2 shadow-none"
                      disabled={isFormDisabled}
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor={`dienThoai-${index}`}>Số điện thoại</Label>
                    <Input
                      id={`dienThoai-${index}`}
                      name="DienThoai"
                      value={member.DienThoai}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full rounded mt-2 shadow-none"
                      disabled={isFormDisabled}
                    />
                  </div>
                  <div className="w-full col-span-2">
                    <Label htmlFor={`diaChi-${index}`}>Địa chỉ</Label>
                    <Textarea
                      id={`diaChi-${index}`}
                      name="DiaChi"
                      value={member.DiaChi}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full rounded mt-2 shadow-none"
                      rows={3}
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              onClick={handleAddAnotherMember}
              className="rounded cursor-pointer bg-blue-600"
              disabled={isFormDisabled}
              aria-label="Thêm thành viên khác"
            >
              Thêm mới
            </Button>
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              disabled={isFormDisabled}
              aria-label="Tạo thành viên mới"
            >
              {createMembersMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Lưu"
              )}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              className="rounded cursor-pointer"
              disabled={isFormDisabled}
              variant="destructive"
              aria-label="Hủy thêm thành viên"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
        <style>
          {`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddMember;
