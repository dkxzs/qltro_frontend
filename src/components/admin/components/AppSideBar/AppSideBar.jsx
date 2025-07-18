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
import { logoutAccountService } from "@/services/accountServices";
import {
  LayoutDashboard,
  LogOut,
  TriangleAlert,
  UserCog,
  Users,
} from "lucide-react";
import { BsHouseGear } from "react-icons/bs";
import { GiExpense } from "react-icons/gi";
import { GrConfigure } from "react-icons/gr";
import { IoWaterOutline } from "react-icons/io5";
import {
  LiaFileContractSolid,
  LiaFileInvoiceDollarSolid,
} from "react-icons/lia";
import { MdElectricBolt, MdOutlineMiscellaneousServices } from "react-icons/md";
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
      url: "/admin/guests",
      icon: UserCog,
      items: [],
    },
    {
      title: "Dịch vụ",
      url: "/admin/services",
      icon: MdOutlineMiscellaneousServices,
      items: [],
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
      title: "Hợp đồng",
      url: "/admin/rents",
      icon: LiaFileContractSolid,
      items: [],
    },
    {
      title: "Hoá đơn",
      url: "/admin/invoices",
      icon: LiaFileInvoiceDollarSolid,
      items: [],
    },
    {
      title: "Chi phí phát sinh",
      url: "/admin/expenses",
      icon: GiExpense,
      items: [],
    },
    {
      title: "Cọc giữ phòng",
      url: "/admin/deposit",
      icon: LiaFileInvoiceDollarSolid,
      items: [],
    },
    {
      title: "Báo cáo sự cố",
      url: "/admin/issues",
      icon: TriangleAlert,
      items: [],
    },
    {
      title: "Tài sản",
      url: "/admin/assets",
      icon: LiaFileInvoiceDollarSolid,
      items: [],
    },
    {
      title: "Nhân viên",
      url: "/admin/staffs",
      icon: Users,
      items: [],
    },
    {
      title: "Tài khoản",
      url: "/admin/accounts",
      icon: TbReport,
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
    logoutAccountService();
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
            className="flex justify-center items-center cursor-pointer "
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span className="text-md">Đăng xuất</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
