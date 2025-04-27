import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContractTemplateTab from "./ContractTemplateTab/ContractTemplateTab";
import EmailConfigTab from "./EmailConfigTab/EmailConfigTab";
import InvoiceTemplateTab from "./InvoiceTemplateTab/InvoiceTemplateTab";
import PersonalInfoTab from "./PersonalInfoTab/PersonalInfoTab";

const tabs = [
  {
    name: "Thông tin cá nhân",
    value: "info",
    component: <PersonalInfoTab />,
  },
  {
    name: "Cấu hình email",
    value: "email",
    component: <EmailConfigTab />,
  },
  {
    name: "Mẫu hợp đồng",
    value: "contract",
    component: <ContractTemplateTab />,
  },
  {
    name: "Mẫu hoá đơn",
    value: "invoice",
    component: <InvoiceTemplateTab />,
  },
];

const AdminConfig = () => {
  return (
    <div className="p-2">
      <Tabs defaultValue={tabs[0].value} className="w-full">
        <div className="flex w-full">
          <TabsList className="p-0 bg-background justify-start border-b rounded-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none bg-background w-full h-full data-[state=active]:shadow-none border-2 border-transparent border-b-border data-[state=active]:border-border data-[state=active]:border-b-background -mb-[2px] rounded-t cursor-pointer"
              >
                <code className="text-md text-black">{tab.name}</code>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="border-b-2 w-full flex-col"></div>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminConfig;
