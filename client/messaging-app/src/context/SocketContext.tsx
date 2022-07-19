import { io, Socket } from "socket.io-client";
import { createContext } from "react";

let socket: Socket;

const setSocket = () => {
    socket && socket.disconnect();
    socket = io(`${process.env.REACT_APP_REST_API_URL}`, {
        withCredentials: true,
    });

    console.log("set socket:", socket);
};

export const socketContext = createContext<
    [Socket, () => void] | [undefined, () => void]
>([undefined, setSocket]);

type Props = {
    children: JSX.Element;
};

function SocketContext({ children }: Props) {
    setSocket();
    return (
        <socketContext.Provider value={[socket, setSocket]}>
            {children}
        </socketContext.Provider>
    );
}

export default SocketContext;
