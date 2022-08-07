import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Message, { messageType, MsgContentType } from "./components/Message";
import { authcontext } from "../../context/AuthContext";
import { socketContext } from "../../context/SocketContext";
import { IoAttach, IoImage, IoVideocam, IoMusicalNotes } from "react-icons/io5";
import ChatRoomInfoPanel from "./components/ChatRoomInfoPanel";

const NUM_MSG = 10;

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
            <ChatRoomInfoPanel roomID={roomID} />
            <div className="h-screen w-full col-span-2 bg-gray-100 flex flex-col justify-end">
                <div
                    className="w-full max-h-full flex flex-col overflow-y-auto px-4 relative scroll-smooth"
                    ref={messageListRef}
                >
                    {!isLastMessage && (
                        <button
                            className="bg-gray-300 rounded-lg px-2 mt-16 md:mt-1 w-fit m-1 mx-auto"
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
                    <span className="bg-white flex rounded-lg shadow w-full relative">
                        <input
                            autoComplete="off"
                            className=" px-2 py-1 w-full rounded-lg"
                            type="text"
                            name="message"
                            id="message"
                            placeholder="Type your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            className="uppercase px-2 py-1 ml-1 bg-gray-300 rounded-lg"
                            onClick={() =>
                                setIsAttachPanelVisible((prev) => !prev)
                            }
                        >
                            <IoAttach />
                        </button>
                        {isAttachPanelVisible && (
                            <div className="bg-gray-200 p-1 rounded-lg absolute top-0 right-0 w-full flex flex-wrap justify-evenly -translate-y-[110%]">
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => sendFileMsg(e, "image")}
                                    id="getImgBtn"
                                    accept="image/*"
                                    multiple
                                />
                                <label
                                    className="py-2 px-4 flex items-center bg-gray-300 rounded-full cursor-pointer m-1"
                                    htmlFor="getImgBtn"
                                >
                                    <IoImage />
                                    <p className="ml-3">Image</p>
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
                                    className="py-2 px-4 flex items-center bg-gray-300 rounded-full cursor-pointer m-1"
                                >
                                    <IoVideocam />
                                    <p className="ml-3">Video</p>
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
                                    className="py-2 px-4 flex items-center bg-gray-300 rounded-full cursor-pointer m-1"
                                >
                                    <IoMusicalNotes />
                                    <p className="ml-3">Audio</p>
                                </label>
                            </div>
                        )}
                    </span>

                    <button
                        className="uppercase px-2 py-1 ml-1 bg-black text-white rounded-lg"
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
