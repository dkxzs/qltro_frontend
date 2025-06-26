import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const NavMain = ({ items }) => {
  const chucVu = useSelector((state) => state.user?.account?.ChucVu);

  const getIconColor = (title) => {
    switch (title) {
      case "Tổng quan":
        return "text-blue-500";
      case "Phòng trọ":
        return "text-yellow-500";
      case "Khách trọ":
        return "text-green-500";
      case "Dịch vụ":
        return "text-purple-500";
      case "Chỉ số điện":
        return "text-orange-500";
      case "Chỉ số nước":
        return "text-blue-700";
      case "Hợp đồng":
        return "text-indigo-500";
      case "Hoá đơn":
        return "text-teal-500";
      case "Thống kê báo cáo":
        return "text-red-500";
      case "Chi phí phát sinh":
        return "text-pink-500";
      case "Cọc giữ phòng":
        return "text-teal-500";
      case "Báo cáo sự cố":
        return "text-red-500";
      case "Tài sản":
        return "text-teal-500";
      case "Nhân viên":
        return "text-gray-500";
      case "Tài khoản":
        return "text-gray-500";
      case "Cấu hình":
        return "text-gray-500";
      default:
        return "text-gray-400";
    }
  };

  const filteredItems = items.filter(
    (item) =>
      chucVu !== "Nhân viên" ||
      (item.title !== "Nhân viên" &&
        item.title !== "Tài khoản" &&
        item.title !== "Cấu hình")
  );

  return (
    <SidebarGroup>
      <SidebarMenu>
        {filteredItems.map((item) =>
          item.items.length === 0 ? (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.url}>
                  {item.icon && (
                    <item.icon
                      className={`${getIconColor(item.title)} size-4 mr-2`}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="cursor-pointer"
                  >
                    {item.icon && (
                      <item.icon
                        className={`${getIconColor(item.title)} size-4 mr-2`}
                      />
                    )}
                    <span>{item.title}</span>
                    {item.items.length > 0 && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link to={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
