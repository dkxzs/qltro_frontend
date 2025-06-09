import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { getAllIssueStatusService } from "@/services/issueService";
import { useQuery } from "@tanstack/react-query";
import { Bell, CircleUser } from "lucide-react";
import { useEffect, useState } from "react";
import { IoKeyOutline } from "react-icons/io5";
import ModalChangePassword from "../ModalChangePassword/ModalChangePassword";

const NavUser = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const { data: issueData } = useQuery({
    queryKey: ["issue"],
    queryFn: () => getAllIssueStatusService(),
  });

  useEffect(() => {
    setUnreadNotifications(issueData?.DT.length);
  }, [issueData]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center gap-3">
          <div className="relative">
            <Bell />
            {unreadNotifications > 0 && (
              <span className="absolute -top-2 -right-1 size-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                size="lg"
                className="flex items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <Avatar className="size-7 rounded-full items-center">
                  <CircleUser className="size-7" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin</span>
                  <span className="truncate text-xs">Xin chào admin</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded">
              <DropdownMenuItem
                className="cursor-pointer rounded"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                <IoKeyOutline />
                Đổi mật khẩu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <ModalChangePassword
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </>
  );
};

export default NavUser;
