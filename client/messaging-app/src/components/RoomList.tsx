import { Room } from "../pages/Home";
import RoomCard from "./RoomCard";

type Props = {
    rooms: Room[];
};

function RoomList({ rooms }: Props) {
    return (
        <div className="w-full h-fit py-6 px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {rooms &&
                rooms.map((room: Room) => (
                    <RoomCard room={room} key={room._id} />
                ))}
        </div>
    );
}

export default RoomList;
