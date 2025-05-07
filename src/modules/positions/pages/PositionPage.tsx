import { PositionProvider } from "@/modules/positions/context/position.context";
import { PositionContainer } from "@/modules/positions/components/position-container/PositionContainer";

const PositionPage = () => {
    return (
        <PositionProvider>
            <PositionContainer />
        </PositionProvider>
    );
};

export default PositionPage;