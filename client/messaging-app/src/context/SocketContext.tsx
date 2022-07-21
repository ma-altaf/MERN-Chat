import { io, Socket } from "socket.io-client";
import { createContext, useEffect, useState } from "react";

export const socketContext = createContext<
    [Socket, () => void] | [undefined, () => void]
>([undefined, () => {}]);

type Props = {
    children: JSX.Element;
};

function SocketContext({ children }: Props) {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);

    const getSocket = () => {
        setSocket(
            io(`${process.env.REACT_APP_REST_API_URL}`, {
                withCredentials: true,
            })
        );

        console.log("set socket:", socket);
    };

    useEffect(() => {
        getSocket();

        return () => {};
    }, []);

    return (
        <socketContext.Provider value={[socket, getSocket]}>
            {children}
        </socketContext.Provider>
    );
}

export default SocketContext;
