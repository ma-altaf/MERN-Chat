import { useContext, useEffect } from "react";
import UserBanner from "../components/UserBanner";
import { authcontext } from "../context/AuthContext";

function Home() {
    const [user, setUser] = useContext(authcontext);

    return (
        <>
            <div className="w-full p-4 flex justify-center items-center">
                <UserBanner user={user} setUser={setUser} />
            </div>
        </>
    );
}

export default Home;
