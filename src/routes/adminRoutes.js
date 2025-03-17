import AdminDashBoard from "@/components/admin/components/AdminDashBoard/AdminDashBoard";
import AdminUser from "@/components/admin/components/AdminUser/AdminUser";
import AdminPage from "@/pages/admin/pages/AdminPage/AdminPage";

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
];
