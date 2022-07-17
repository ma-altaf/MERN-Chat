import { io, Socket } from "socket.io-client";
import { createContext } from "react";

const socket = io(`${process.env.REACT_APP_REST_API_URL}`);
export const socketContext = createContext<Socket | undefined>(socket);

type Props = {
    children: JSX.Element;
};

function SocketContext({ children }: Props) {
    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    );
}

export default SocketContext;
