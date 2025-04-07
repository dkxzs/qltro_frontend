import { AppSidebar } from "@/components/admin/components/AppSideBar/AppSideBar";
import NavUser from "@/components/admin/components/NavUser/NavUser";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IoMenuOutline } from "react-icons/io5";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex sticky top-0 bg-white justify-between h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b mb-1">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 cursor-pointer hover:bg-white">
                <IoMenuOutline className="size-7 font-bold" />
              </SidebarTrigger>
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div className="mr-2">
              <NavUser />
            </div>
          </header>
          <div>
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      
    </>
  );
};

export default AdminPage;
