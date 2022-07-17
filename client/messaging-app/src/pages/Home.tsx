import { createContext, useContext, useEffect, useState } from "react";
import RequestCmpt from "../components/RequestCmpt";
import RoomList from "../components/RoomList";
import UserBanner from "../components/UserBanner";
import { authcontext, User } from "../context/AuthContext";
import apiFetch from "../utils/apiFetch";
import { io, Socket } from "socket.io-client";

export type Room = {
    _id: string;
    members: [User];
};

const socket = io(`${process.env.REACT_APP_REST_API_URL}`);
export const socketContext = createContext<Socket>(socket);

function Home() {
    const [user, setUser] = useContext(authcontext);
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        getRooms();

        return () => {};
    }, []);

    const getRooms = async () => {
        setRooms(await (await apiFetch("/user/contactList")).json());
    };

    return (
        <>
            <div className="w-full p-4 flex flex-col justify-center items-center">
                <UserBanner user={user} setUser={setUser} />
                <RequestCmpt />
                <socketContext.Provider value={socket}>
                    <RoomList rooms={rooms} />
                </socketContext.Provider>
            </div>
        </>
    );
}

export default Home;
