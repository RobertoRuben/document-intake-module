import { SettlementProvider } from "@/modules/settlement/context/settlement.context";
import { SettlementContainer } from "@/modules/settlement/components/settlement-container/SettlementContainer";

const SettlementPage = () => {
    return (
        <SettlementProvider>
            <SettlementContainer />
        </SettlementProvider>
    );
};

export default SettlementPage;