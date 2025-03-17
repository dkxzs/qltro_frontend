import NavMain from "@/components/admin/components/NavMain/NavMain.jsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog } from "lucide-react";
import { BsHouseGear } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { IoWaterOutline } from "react-icons/io5";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import {
  MdElectricBolt,
  MdOutlineBedroomParent,
  MdOutlineMiscellaneousServices,
} from "react-icons/md";
import { TbReport } from "react-icons/tb";
import TeamSwitcher from "../TeamSwitcher/TeamSwitcher";
import { useNavigate } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Tổng quan",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: false,
      items: [],
    },
    {
      title: "Phòng trọ",
      url: "",
      icon: BsHouseGear,
      isActive: false,
      items: [
        {
          title: "Quản lý phòng trọ",
          url: "/admin/rooms",
        },
        {
          title: "Danh sách loại phòng",
          url: "/admin/room-types",
        },
      ],
    },
    {
      title: "Khách trọ",
      url: "",
      icon: UserCog,
      items: [
        {
          title: "Quản lý khách trọ",
          url: "/admin/guests",
        },
      ],
    },
    {
      title: "Dịch vụ",
      url: "",
      icon: MdOutlineMiscellaneousServices,
      items: [
        {
          title: "Quản lý dịch vụ",
          url: "/admin/services",
        },
      ],
    },
    {
      title: "Chỉ số điện",
      url: "",
      icon: MdElectricBolt,
      items: [],
    },
    {
      title: "Chỉ số nước",
      url: "",
      icon: IoWaterOutline,
      items: [],
    },
    {
      title: "Thuê phòng",
      url: "",
      icon: MdOutlineBedroomParent,
      items: [
        {
          title: "Quản lý thuê phòng",
          url: "/admin/rentals",
        },
      ],
    },
    {
      title: "Hoá đơn",
      url: "",
      icon: LiaFileInvoiceDollarSolid,
      items: [
        {
          title: "Quản lý hoá đơn",
          url: "#",
        },
      ],
    },
    {
      title: "Thống kê báo cáo",
      url: "",
      icon: TbReport,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div
          className="flex items-center gap-2 justify-center hover:bg-accent rounded-sm"
          onClick={() => navigate("/admin/login")}
        >
          <SidebarMenuButton className="flex justify-center cursor-pointer">
            <FiLogOut className="size-4" />
            <span className="text-md">Đăng xuất</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
