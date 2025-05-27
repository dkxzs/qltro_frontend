import { useSelector } from "react-redux";
import ContractView from "./ContractView";

const ContractTemplateTab = () => {
  const template = useSelector((state) => state.contractConfig.template);
  return (
    <div className="mt-6 space-y-3">
      <h2 className="text-xl font-bold">Mẫu hợp đồng</h2>
      <ContractView template={template} />
    </div>
  );
};

export default ContractTemplateTab;
