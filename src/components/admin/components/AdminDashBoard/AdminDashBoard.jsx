import { LayoutDashboard } from "lucide-react";
import SectionCards from "./SectionCard";
import Dashboard from "./DashboardContainer";

const AdminDashBoard = () => {
  return (
    <div className="p-2 bg-gray-100">
      <div className="flex gap-2 items-center mb-2">
        <LayoutDashboard />
        <h1 className="font-semibold text-2xl">Tổng quan</h1>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-1">
          <div className="flex flex-col gap-4 py-4 md:gap-2 md:py-2">
            <SectionCards />
          </div>
        </div>
        <div>
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
