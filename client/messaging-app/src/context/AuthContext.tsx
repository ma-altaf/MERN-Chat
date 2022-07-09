import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export const authcontext = createContext({});

type Props = {
    children: JSX.Element;
};

function AuthContext({ children }: Props) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        getUser();

        return () => {};
    }, [user]);

    const getUser = async () => {
        try {
            const auth = await apiFetch("/users/getUser");

            if (!auth.ok) {
                return alert("User could not be requested");
            }

            setUser(auth);

            if (!auth) {
                navigate("/");
            }
        } catch (error) {
            alert("Error fetching the user");
        }
    };

    return <authcontext.Provider value={user}>{children}</authcontext.Provider>;
}

export default AuthContext;
