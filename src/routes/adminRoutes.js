import AdminDashBoard from "@/components/admin/components/AdminDashBoard/AdminDashBoard";
import AdminRoom from "@/components/admin/components/AdminRoom/AdminRoom";
import AdminRoomType from "@/components/admin/components/AdminRoomType/AdminRoomType";
import AdminService from "@/components/admin/components/AdminService/AdminService";
import AdminUser from "@/components/admin/components/AdminUser/AdminUser";

export const adminRoutes = [
  // {
  //   path: "/admin",
  //   page: AdminPage,
  // },
  {
    path: "dashboard",
    page: AdminDashBoard,
    index: true, // đánh dấu đây là index route
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
];
