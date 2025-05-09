import { UserProvider } from "@/modules/users/context/user.context";
import { UserContainer } from "@/modules/users/components/user-container/UserContainer";

const UserPage = () => {
    return (
        <UserProvider>
            <UserContainer />
        </UserProvider>
    );
};

export default UserPage;