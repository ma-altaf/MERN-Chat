import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import apiFetch from "../../../utils/apiFetch";
import defaultPPImg from "../../../assets/defaultPP.jpg";

type State = {
    avatarURL: string | undefined;
    username: string | undefined;
    about: string | undefined;
};

type Props = {
    roomID: string | undefined;
};

function ChatRoomInfoPanel({ roomID }: Props) {
    const [state, setState] = useState(useLocation()?.state as State | null);

    useEffect(() => {
        // request for user data incase state is empty
        const requestUserData = async () => {
            try {
                const userReq = await apiFetch("/user/contactDetail", "POST", {
                    roomID,
                });

                if (userReq.ok) {
                    setState(await userReq.json());
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (state === null) {
            requestUserData();
        }

        return;
    }, []);

    return (
        <div className="md:h-full w-full bg-accent-base dark:bg-primary-dark-gray text-white z-50 top-0 absolute md:relative flex md:flex-col items-center py-2 md:py-10">
            <Link
                to={"/home"}
                className="md:absolute top-0 p-1 m-1 left-0 text-xl md:text-3xl"
            >
                <IoArrowBack />
            </Link>
            <img
                className="aspect-square w-10 md:w-[50%] rounded-full object-cover"
                src={state?.avatarURL || defaultPPImg}
                alt={state?.username}
            />
            <p className="text-xl mx-2 md:text-3xl md:my-4">
                {state?.username}
            </p>
            <p className="p-4 hidden md:block">{state?.about}</p>
        </div>
    );
}

export default ChatRoomInfoPanel;
