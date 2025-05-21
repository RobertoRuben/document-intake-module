import { HamletProvider } from "@/modules/hamlets/context/hamlet.context";
import { HamletContainer } from "@/modules/hamlets/components/hamlet-container/HamletContainer";

const HamletPage = () => {
    return (
        <HamletProvider>
            <HamletContainer />
        </HamletProvider>
    );
};

export default HamletPage;