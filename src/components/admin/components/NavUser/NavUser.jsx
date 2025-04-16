import { Avatar } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { FaRegUserCircle } from "react-icons/fa";

const NavUser = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          size="lg"
          className="flex items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-full items-center">
            <FaRegUserCircle className="size-7" />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Admin</span>
            <span className="truncate text-xs">Xin chào admin</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
