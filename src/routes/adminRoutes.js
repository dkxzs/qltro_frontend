import AdminConfig from "@/components/admin/components/AdminConfig/AdminConfig";
import AdminUser from "@/components/admin/components/AdminCustomer/AdminCustomer";
import AdminViewCustomer from "@/components/admin/components/AdminCustomer/AdminViewCustomer";
import AdminDashBoard from "@/components/admin/components/AdminDashBoard/AdminDashBoard";
import AdminDeposit from "@/components/admin/components/AdminDeposit/AdminDepostit";
import AdminElectricity from "@/components/admin/components/AdminElectricity/AdminElectricity";
import AdminExpense from "@/components/admin/components/AdminExpense/AdminExpense";
import AdminHouse from "@/components/admin/components/AdminHouse/AdminHouse";
import AdminInvoice from "@/components/admin/components/AdminInvoice/AdminInvoice";
import AdminIssue from "@/components/admin/components/AdminIssue/AdminIssue";
import AdminRent from "@/components/admin/components/AdminRent/AdminRent";
import AdminViewInfo from "@/components/admin/components/AdminRent/AdminViewInfo";
import AdminRoom from "@/components/admin/components/AdminRoom/AdminRoom";
import AdminViewRoom from "@/components/admin/components/AdminRoom/AdminViewRoom";
import AdminRoomType from "@/components/admin/components/AdminRoomType/AdminRoomType";
import AdminService from "@/components/admin/components/AdminService/AdminService";
import AdminStaff from "@/components/admin/components/AdminStaff/AdminStaff";
import AdminWater from "@/components/admin/components/AdminWater/AdminWater";

export const adminRoutes = [
  {
    path: "dashboard",
    page: AdminDashBoard,
    index: true,
  },
  {
    path: "guests",
    page: AdminUser,
  },
  {
    path: "rooms",
    page: AdminRoom,
  },
  {
    path: "services",
    page: AdminService,
  },
  {
    path: "room-types",
    page: AdminRoomType,
  },
  {
    path: "electricity",
    page: AdminElectricity,
  },
  {
    path: "water",
    page: AdminWater,
  },
  {
    path: "houses",
    page: AdminHouse,
  },
  {
    path: "invoices",
    page: AdminInvoice,
  },
  {
    path: "expenses",
    page: AdminExpense,
  },
  {
    path: "rents",
    page: AdminRent,
  },
  {
    path: "config",
    page: AdminConfig,
  },
  {
    path: "view-info",
    page: AdminViewInfo,
  },
  {
    path: "view-room",
    page: AdminViewRoom,
  },
  {
    path: "view-customer",
    page: AdminViewCustomer,
  },
  {
    path: "deposit",
    page: AdminDeposit,
  },
  {
    path: "issues",
    page: AdminIssue,
  },
  {
    path: "staffs",
    page: AdminStaff,
  },
];
