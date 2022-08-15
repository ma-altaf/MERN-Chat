import { Room } from "..";
import defaultPPImg from "../../../assets/defaultPP.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Props = {
    room: Room;
    index: number;
};

function RoomCard({ room, index }: Props) {
    const navigate = useNavigate();
    const { roomID, username, avatarURL, about } = room;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                delay: 0.2 + index * 0.1,
                duration: 0.3,
                ease: "linear",
            }}
            className="bg-primary-light-white dark:bg-primary-dark-gray rounded-lg p-4 flex flex-col items-center shadow cursor-pointer"
            onClick={() =>
                navigate(`/chat_room/${roomID}`, {
                    state: { avatarURL, username, about },
                })
            }
        >
            <img
                className="w-32 rounded-full aspect-square object-cover"
                src={avatarURL || defaultPPImg}
                alt={username}
            />
            <div className="p-1 h-full flex flex-col items-center">
                <h1 className="font-semibold text-lg">{username}</h1>
                <p>{about}</p>
            </div>
        </motion.div>
    );
}

export default RoomCard;
