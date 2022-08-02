import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Message, { messageType, MsgContentType } from "../components/Message";
import { authcontext } from "../context/AuthContext";
import { socketContext } from "../context/SocketContext";
import { IoAttach, IoArrowBack } from "react-icons/io5";
import defaultPPImg from "../assets/defaultPP.jpg";

const NUM_MSG = 3;

function ChatRoom() {
    const isMoreMsgRequested = useRef(false);
    const isMsgRequested = useRef(false);
    const [user] = useContext(authcontext);
    const { roomID } = useParams();
    const [socket] = useContext(socketContext);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<messageType[]>([]);
    const [isLastMessage, setIsLastMessage] = useState(false);
    const messageListRef = useRef<HTMLDivElement>(null);
    const [isAttachPanelVisible, setIsAttachPanelVisible] = useState(false);
    // @ts-ignore
    const { avatarURL, username } = useLocation()?.state;

    useEffect(() => {
        const getPrevMsg = (messageRes: messageType[]) => {
            messageRes.reverse();
            setMessages((prev) => [...messageRes, ...prev]);
            setIsLastMessage(messageRes.length < NUM_MSG);
            isMoreMsgRequested.current = false;
        };

        const newMsg = (msg: messageType) =>
            setMessages((prev) => [...prev, msg]);

        socket?.on("joined", getPrevMsg);

        socket?.on("receive_msg", newMsg);

        socket?.on("get_msg", getPrevMsg);

        if (socket && !isMsgRequested.current) {
            isMsgRequested.current = true;
            socket?.emit("join_room", roomID);
            //TODO: remove console.log("request made:", socket);
        }

        return () => {
            socket?.off("joined", getPrevMsg);
            socket?.off("receive_msg", newMsg);
            socket?.off("get_msg", getPrevMsg);
        };
    }, [socket]);

    const createMsg = (content: string, type: MsgContentType): messageType => ({
        content,
        sender: { username: user?.username || "" },
        type: type,
        roomID: roomID!,
        createdAt: new Date().toISOString(),
    });

    const sendTextMsg = () => {
        // do not send the message if there is no text content
        if (message.length === 0) {
            return;
        }
        const newMsg = createMsg(message, "text");
        socket?.emit("send_msg", newMsg);

        // clear message text input on message submission
        setMessage("");

        // display message locally
        setMessages((prev) => [...prev, newMsg]);
    };

    const sendFileMsg = async (
        e: ChangeEvent<HTMLInputElement>,
        msgType: MsgContentType
    ) => {
        const files = e.target.files;
        if (!files) {
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const newMsg = createMsg("", msgType);

            const file = new FileReader();
            file.readAsDataURL(files[i]);

            file.onloadend = () => {
                socket?.emit("send_msg", { ...newMsg, content: file.result });
            };
        }
    };

    const getMsg = async () => {
        if (!isMoreMsgRequested.current) {
            isMoreMsgRequested.current = true;
            socket?.emit("get_msg");
        }
    };

    return (
        <div className="w-full h-screen grid grid-cols-1 md:grid-cols-3">
            <div className="md:h-full w-full bg-green-200 z-50 top-0 absolute md:relative flex md:flex-col items-center py-1 md:py-10">
                <Link
                    to={"/home"}
                    className="md:absolute top-0 p-1 left-0 text-xl md:text-3xl"
                >
                    <IoArrowBack />
                </Link>
                <img
                    className="aspect-square w-10 md:w-[50%] rounded-full object-cover"
                    src={avatarURL || defaultPPImg}
                    alt={username}
                />
                <p className="text-xl mx-2 md:text-3xl md:my-4">{username}</p>
            </div>
            <div className="h-screen w-full col-span-2 bg-gray-100 flex flex-col justify-end">
                <div
                    className="w-full max-h-full flex flex-col overflow-y-auto px-4 relative"
                    ref={messageListRef}
                >
                    {!isLastMessage && (
                        <button
                            className="bg-gray-300 rounded-lg px-2 mt-14 md:mt-1 w-fit m-1 mx-auto"
                            onClick={getMsg}
                        >
                            Load more
                        </button>
                    )}
                    {messages.map((msg: messageType, i) => (
                        <Message key={i} message={msg} />
                    ))}
                    {/* TODO: make the component only available when scroll is needed */}
                    <button
                        className="sticky bottom-0 right-0 mr-auto my-2 py-1 px-2 bg-gray-300 rounded-lg w-fit"
                        onClick={() => {
                            messageListRef.current &&
                                (messageListRef.current.scrollTop =
                                    messageListRef.current?.scrollHeight || 0);
                        }}
                    >
                        Scroll to bottom
                    </button>
                </div>
                <span className="flex justify-between py-2 bottom-0 z-10 bg-gray-100 px-4 relative">
                    <input
                        autoComplete="off"
                        className="rounded-lg shadow px-2 py-1 w-full"
                        type="text"
                        name="message"
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    {isAttachPanelVisible && (
                        <div className="bg-gray-200 py-3 px-1 rounded-lg absolute top-0 -translate-y-[100%]">
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => sendFileMsg(e, "image")}
                                id="getImgBtn"
                                accept="image/*"
                                multiple
                            />
                            <label
                                className="uppercase aspect-square py-2 px-4 bg-gray-300 rounded-full cursor-pointer m-1"
                                htmlFor="getImgBtn"
                            >
                                image
                            </label>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => sendFileMsg(e, "video")}
                                id="getVidBtn"
                                accept="video/*"
                                multiple
                            />
                            <label
                                htmlFor="getVidBtn"
                                className="uppercase aspect-square py-2 px-4 bg-gray-300 rounded-full cursor-pointer m-1"
                            >
                                video
                            </label>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => sendFileMsg(e, "audio")}
                                id="getAudioBtn"
                                accept="audio/*"
                                multiple
                            />
                            <label
                                htmlFor="getAudioBtn"
                                className="uppercase aspect-square py-2 px-4 bg-gray-300 rounded-full cursor-pointer m-1"
                            >
                                audio
                            </label>
                        </div>
                    )}

                    <button
                        className="uppercase px-2 py-1 ml-1 bg-gray-300 rounded-lg"
                        onClick={() => setIsAttachPanelVisible((prev) => !prev)}
                    >
                        <IoAttach />
                    </button>
                    <button
                        className="uppercase px-2 py-1 ml-1 bg-green-500 rounded-lg"
                        onClick={sendTextMsg}
                    >
                        send
                    </button>
                </span>
            </div>
        </div>
    );
}

export default ChatRoom;
