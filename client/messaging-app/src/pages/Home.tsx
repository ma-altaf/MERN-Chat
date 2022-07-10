import { useContext, useEffect } from "react";
import { authcontext } from "../context/AuthContext";

function Home() {
    const [user] = useContext(authcontext);

    return <div>{user && user.username}</div>;
}

export default Home;
