import DashboardContracts from "./Dashboard/DashboardCustomer";
import DashboardContractExpiring from "./Dashboard/DashboardContractExpiring";
import DashboardExpense from "./Dashboard/DashboardExpense";
import DashboardProfit from "./Dashboard/DashboardProfit";
import DashboardRevenue from "./Dashboard/DashboardRevenue";
import DashboardRoomStatus from "./Dashboard/DashboardRoomStatus";

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
        <p className="font-semibold text-black">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-black">
            {entry.name}:{" "}
            {entry.dataKey.includes("Percentage")
              ? `${entry.value}%`
              : new Intl.NumberFormat("vi-VN").format(entry.value) + " VND"}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardContainer = () => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardRevenue customTooltip={<CustomTooltip />} />
        <DashboardProfit customTooltip={<CustomTooltip />} />
        <DashboardRoomStatus />
        <DashboardExpense />
        <DashboardContracts />
      </div>
      <div>
        <DashboardContractExpiring />
      </div>
    </div>
  );
};

export default DashboardContainer;
