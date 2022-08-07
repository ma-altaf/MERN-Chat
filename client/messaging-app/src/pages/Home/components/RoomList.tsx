import { Room } from "..";
import RoomCard from "./RoomCard";

type Props = {
    rooms: Room[];
};

function RoomList({ rooms }: Props) {
    return (
        <div className="w-full h-fit py-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:px-10">
            {rooms &&
                rooms.map((room: Room) => (
                    <RoomCard room={room} key={room.roomID} />
                ))}
        </div>
    );
}

export default RoomList;
