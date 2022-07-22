import { io, Socket } from "socket.io-client";
import { createContext, useEffect, useState } from "react";

export const socketContext = createContext<
    [Socket, () => void] | [undefined, (force?: boolean) => void]
>([undefined, () => {}]);

type Props = {
    children: JSX.Element;
};

function SocketContext({ children }: Props) {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);

    const getSocket = (force = false) => {
        setSocket((prev) => {
            if (force || !prev) {
                return io(`${process.env.REACT_APP_REST_API_URL}`, {
                    withCredentials: true,
                });
            }
            return prev;
        });
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
