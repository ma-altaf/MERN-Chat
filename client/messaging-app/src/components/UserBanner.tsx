import { User } from "../context/AuthContext";
import { IoExit } from "react-icons/io5";
import EditableProfileImg from "./EditableProfileImg";
import apiFetch from "../utils/apiFetch";
import { useNavigate } from "react-router-dom";

type Props = {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User>> | undefined;
};
function UserBanner({ user, setUser }: Props) {
    const navigate = useNavigate();

    const logOut = async () => {
        const res = await apiFetch("/users/logout");
        if (res.ok) {
            setUser !== undefined &&
                setUser({ username: "", avatarURL: "", about: "" });
            navigate("/");
        } else {
            alert("Could not log out");
        }
    };

    return (
        <div className="w-full lg:w-1/2 rounded-lg p-8 shadow bg-white flex justify-center items-center flex-col lg:flex-row relative">
            <button
                className="absolute top-0 right-0 m-1 p-1 text-2xl"
                onClick={logOut}
            >
                <IoExit />
            </button>
            <EditableProfileImg />
            <div className="w-full h-full mx-4">
                <h1 className="mx-auto w-fit lg:m-0 my-2 text-3xl">
                    {user?.username || ""}
                </h1>
                <p> {user?.about || ""}</p>
            </div>
        </div>
    );
}

export default UserBanner;
