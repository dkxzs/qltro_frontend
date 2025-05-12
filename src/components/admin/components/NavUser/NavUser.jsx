import { Avatar } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { FaRegUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalChangePassword from "../ModalChangePassword/ModalChangePassword";
import { IoKeyOutline } from "react-icons/io5";

const NavUser = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                size="lg"
                className="flex items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <Avatar className="h-8 w-8 rounded-full items-center">
                  <FaRegUserCircle className="size-7" />
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
