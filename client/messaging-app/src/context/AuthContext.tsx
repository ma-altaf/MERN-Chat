import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export type User = {
    username: string;
    avatarURL: string;
};

type AuthContextType = [User, React.Dispatch<React.SetStateAction<User>>] | [];

export const authcontext = createContext<AuthContextType>([]);

type Props = {
    children: JSX.Element;
};

function AuthContext({ children }: Props) {
    const [user, setUser] = useState({
        username: "",
        avatarURL: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        getUser();

        return () => {};
    }, []);

    const getUser = async () => {
        try {
            const auth = await apiFetch("/users/getUser");

            if (!auth.ok) {
                return navigate("/");
            }

            const userData: User = await auth.json();

            setUser(userData);
        } catch (error) {
            alert("Error fetching the user");
        }
    };

    return (
        <authcontext.Provider value={[user, setUser]}>
            {children}
        </authcontext.Provider>
    );
}

export default AuthContext;
