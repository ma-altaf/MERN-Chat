import { Room } from "../pages/Home";
import defaultPPImg from "../assets/defaultPP.jpg";
import { useNavigate } from "react-router-dom";

type Props = {
    room: Room;
};

function RoomCard({ room }: Props) {
    const navigate = useNavigate();
    const { roomID, username, avatarURL } = room;

    return (
        <div
            className="bg-white rounded-lg p-4 flex flex-col items-center shadow cursor-pointer"
            onClick={() =>
                navigate(`/chat_room/${roomID}`, {
                    state: { avatarURL, username },
                })
            }
        >
            <img
                className="w-32 rounded-full aspect-square object-cover"
                src={avatarURL || defaultPPImg}
                alt={username}
            />
            <div className="p-1 h-full flex items-center">
                <h1>{username}</h1>
            </div>
        </div>
    );
}

export default RoomCard;
