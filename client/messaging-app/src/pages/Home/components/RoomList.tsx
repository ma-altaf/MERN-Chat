import { Room } from "..";
import RoomCard from "./RoomCard";
import { motion } from "framer-motion";

type Props = {
    rooms: Room[];
};

function RoomList({ rooms }: Props) {
    return (
        <motion.div
            layout
            className="w-full h-fit py-6 grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 lg:px-10"
        >
            {rooms &&
                rooms.map((room: Room, i) => (
                    <RoomCard room={room} index={i} key={room.roomID} />
                ))}
        </motion.div>
    );
}

export default RoomList;
