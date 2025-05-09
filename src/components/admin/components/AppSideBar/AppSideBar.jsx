import NavMain from "@/components/admin/components/NavMain/NavMain.jsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { logout } from "@/redux/slices/userSlice";
import { LayoutDashboard, UserCog } from "lucide-react";
import { BsHouseGear } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { GiExpense } from "react-icons/gi";
import { GrConfigure } from "react-icons/gr";
import { IoWaterOutline } from "react-icons/io5";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import {
  MdElectricBolt,
  MdOutlineBedroomParent,
  MdOutlineMiscellaneousServices,
} from "react-icons/md";
import { TbReport } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TeamSwitcher from "../TeamSwitcher/TeamSwitcher";

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
          title: "Nhà Trọ",
          url: "/admin/houses",
        },
        {
          title: "Quản lý phòng trọ",
          url: "/admin/rooms",
        },
        {
          title: "Loại phòng",
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
      url: "/admin/electricity",
      icon: MdElectricBolt,
      items: [],
    },
    {
      title: "Chỉ số nước",
      url: "/admin/water",
      icon: IoWaterOutline,
      items: [],
    },
    {
      title: "Thuê phòng",
      url: "/admin/rents",
      icon: MdOutlineBedroomParent,
      items: [],
    },
    {
      title: "Hoá đơn",
      url: "",
      icon: LiaFileInvoiceDollarSolid,
      items: [
        {
          title: "Quản lý hoá đơn",
          url: "/admin/invoices",
        },
      ],
    },
    {
      title: "Thống kê báo cáo",
      url: "/admin/reports",
      icon: TbReport,
      items: [],
    },
    {
      title: "Chi phí phát sinh",
      url: "/admin/expenses",
      icon: GiExpense,
      items: [],
    },
    {
      title: "Cấu hình",
      url: "/admin/config",
      icon: GrConfigure,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center justify-center hover:bg-accent rounded">
          <SidebarMenuButton
            className="flex justify-center items-center cursor-pointer"
            onClick={handleLogout}
          >
            <FiLogOut className="size-4" />
            <span className="text-md">Đăng xuất</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
