import { useContext } from "react";
import { authcontext } from "../context/AuthContext";
import { Room } from "../pages/Home";
import defaultPPImg from "../assets/defaultPP.jpg";
import { useNavigate } from "react-router-dom";

type Props = {
    room: Room;
};
function RoomCard({ room }: Props) {
    const navigate = useNavigate();
    const [user] = useContext(authcontext);
    const { _id: roomID, members } = room;

    const roomData = members.find(
        (element) => element.username != user?.username
    );

    return (
        <div
            className="bg-white rounded-lg p-4 flex flex-col items-center shadow cursor-pointer"
            onClick={() => navigate(`/chat_room/${roomID}`)}
        >
            <img
                className="w-32 rounded-full aspect-square object-cover"
                src={roomData?.avatarURL || defaultPPImg}
                alt={roomData?.username}
            />
            <div className="p-1 h-full flex items-center">
                <h1>{roomData?.username}</h1>
            </div>
        </div>
    );
}

export default RoomCard;
