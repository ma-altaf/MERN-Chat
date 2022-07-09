import { useEffect } from "react";
import apiFetch from "../utils/apiFetch";

function Home() {
    useEffect(() => {
        apiFetch("/users/getUser");

        return () => {};
    }, []);

    return <div>Home</div>;
}

export default Home;
