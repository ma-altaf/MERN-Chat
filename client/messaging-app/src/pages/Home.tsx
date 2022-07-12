import { useContext, useEffect } from "react";
import RequestCmpt from "../components/RequestCmpt";
import UserBanner from "../components/UserBanner";
import { authcontext } from "../context/AuthContext";

function Home() {
    const [user, setUser] = useContext(authcontext);

    return (
        <>
            <div className="w-full p-4 flex flex-col justify-center items-center">
                <UserBanner user={user} setUser={setUser} />
                <RequestCmpt />
            </div>
        </>
    );
}

export default Home;
