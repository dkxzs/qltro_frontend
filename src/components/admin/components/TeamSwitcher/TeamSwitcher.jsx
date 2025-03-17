import { SiGooglecampaignmanager360 } from "react-icons/si";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

const TeamSwitcher = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              size="lg"
              className="flex gap-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <SiGooglecampaignmanager360 className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-2xl fontFamily tracking-widest">
                  Tro247
                </span>
                <span className="truncate text-xs font-semibold">
                  Hệ thống quản lý phòng trọ
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default TeamSwitcher;
