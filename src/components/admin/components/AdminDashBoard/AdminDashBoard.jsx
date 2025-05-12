import { LayoutDashboard } from "lucide-react";
import SectionCards from "./SectionCard";

const AdminDashBoard = () => {
  return (
    <div className="p-2">
      <div className="flex gap-2 items-center">
        <LayoutDashboard />
        <h1 className="font-semibold text-3xl">Tổng quan</h1>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-1">
          <div className="flex flex-col gap-4 py-4 md:gap-2 md:py-2">
            <SectionCards />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
