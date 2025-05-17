import AdminHouse from "@/components/admin/components/AdminHouse/AdminHouse";
import AdminDashBoard from "@/components/admin/components/AdminDashBoard/AdminDashBoard";
import AdminElectricity from "@/components/admin/components/AdminElectricity/AdminElectricity";
import AdminInvoice from "@/components/admin/components/AdminInvoice/AdminInvoice";
import AdminRent from "@/components/admin/components/AdminRent/AdminRent";
import AdminReport from "@/components/admin/components/AdminReport/AdminReport";
import AdminRoom from "@/components/admin/components/AdminRoom/AdminRoom";
import AdminRoomType from "@/components/admin/components/AdminRoomType/AdminRoomType";
import AdminService from "@/components/admin/components/AdminService/AdminService";
import AdminUser from "@/components/admin/components/AdminCustomer/AdminCustomer";
import AdminWater from "@/components/admin/components/AdminWater/AdminWater";
import AdminExpense from "@/components/admin/components/AdminExpense/AdminExpense";
import AdminConfig from "@/components/admin/components/AdminConfig/AdminConfig";
import AdminViewInfo from "@/components/admin/components/AdminRent/AdminViewInfo";
import AdminViewRoom from "@/components/admin/components/AdminRoom/AdminViewRoom";
import AdminViewCustomer from "@/components/admin/components/AdminCustomer/AdminViewCustomer";

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
    path: "reports",
    page: AdminReport,
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
];
