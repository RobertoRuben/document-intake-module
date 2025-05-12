import { SettlementProvider } from "@/modules/settlements/context/settlement.context";
import { SettlementContainer } from "@/modules/settlements/components/settlement-container/SettlementContainer";

const SettlementPage = () => {
    return (
        <SettlementProvider>
            <SettlementContainer />
        </SettlementProvider>
    );
};

export default SettlementPage;