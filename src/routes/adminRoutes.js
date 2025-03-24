import AdminBuilding from "@/components/admin/components/AdminBuilding/AdminBuilding";
import AdminDashBoard from "@/components/admin/components/AdminDashBoard/AdminDashBoard";
import AdminElectricity from "@/components/admin/components/AdminElectricity/AdminElectricity";
import AdminInvoice from "@/components/admin/components/AdminInvoice/AdminInvoice";
import AdminRent from "@/components/admin/components/AdminRent/AdminRent";
import AdminReport from "@/components/admin/components/AdminReport/AdminReport";
import AdminRoom from "@/components/admin/components/AdminRoom/AdminRoom";
import AdminRoomType from "@/components/admin/components/AdminRoomType/AdminRoomType";
import AdminService from "@/components/admin/components/AdminService/AdminService";
import AdminUser from "@/components/admin/components/AdminUser/AdminUser";
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
    path: "buildings",
    page: AdminBuilding,
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
    path: "rents",
    page: AdminRent,
  },
];
