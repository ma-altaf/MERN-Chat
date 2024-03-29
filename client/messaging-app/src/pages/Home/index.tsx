import { useContext, useEffect, useState } from "react";
import RequestCmpt from "./components/RequestCmpt";
import RoomList from "./components/RoomList";
import UserBanner from "./components/UserBanner";
import { authcontext } from "../../context/AuthContext";
import { socketContext } from "../../context/SocketContext";
import apiFetch from "../../utils/apiFetch";
import { LayoutGroup } from "framer-motion";

export type Room = {
    roomID: string;
    username: string;
    avatarURL: string;
    about: string;
};

function Home() {
    const [socket] = useContext(socketContext);
    const [user, setUser] = useContext(authcontext);
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        getRooms();

        leaveRooms();

        return () => {};
    }, []);

    const getRooms = async () => {
        setRooms(await (await apiFetch("/user/contactList")).json());
    };

    const leaveRooms = () => {
        socket?.emit("leave_room");
    };

    return (
        <div className="w-full p-4 flex flex-col justify-center items-center overflow-hidden">
            <UserBanner user={user} setUser={setUser} />
            <LayoutGroup>
                <RequestCmpt />
                <RoomList rooms={rooms} />
            </LayoutGroup>
        </div>
    );
}

export default Home;
