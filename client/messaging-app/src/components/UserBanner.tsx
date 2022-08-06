import { User } from "../context/AuthContext";
import { IoExit, IoCreateOutline, IoClose } from "react-icons/io5";
import EditableProfileImg from "./EditableProfileImg";
import apiFetch from "../utils/apiFetch";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Props = {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User>> | undefined;
};
function UserBanner({ user, setUser }: Props) {
    const navigate = useNavigate();
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newAbout, setNewAbout] = useState("");

    useEffect(() => {
        setNewUsername(user?.username || "");
        setNewAbout(user?.about || "");

        return;
    }, [user]);

    const logOut = async () => {
        if (window.confirm("Confirm log out")) {
            const res = await apiFetch("/users/logout");
            if (res.ok) {
                setUser !== undefined &&
                    setUser({ username: "", avatarURL: "", about: "" });
                navigate("/");
            } else {
                alert("Could not log out");
            }
        }
    };

    const changeName = async () => {
        const res = await apiFetch("/users/changeUsername", "POST", {
            newUsername,
        });

        if (res.ok) {
            setUser?.((prev) => ({ ...prev, username: newUsername }));
            setIsEditProfile(false);
        } else {
            setNewUsername(user?.username || "");
            window.alert("Username could not be changed.");
        }
    };

    const changeAbout = async () => {
        const res = await apiFetch("/users/changeAbout", "POST", {
            newAbout,
        });

        if (res.ok) {
            setUser?.((prev) => ({ ...prev, about: newAbout }));
            setIsEditProfile(false);
        } else {
            setNewAbout(user?.about || "");
            window.alert("About could not be changed.");
        }
    };

    return (
        <div className="w-full lg:w-1/2 rounded-lg p-8 shadow bg-white flex justify-center items-center flex-col lg:flex-row relative">
            {isEditProfile && (
                <div className="fixed flex flex-col justify-center items-start z-50 rounded-lg top-1/2 md:left-1/2 md:-translate-x-1/2 -translate-y-1/2 shadow-2xl md:max-w-1/2 h-fit bg-white p-4">
                    <span className="p-1">
                        <label htmlFor="newUsername">Name:</label>
                        <input
                            type="text"
                            name="newUsername"
                            id="newUsername"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="border-2 rounded-lg p-1 mx-1 focus:border-black"
                        />
                        <button
                            className="bg-black rounded-lg text-white px-2 p-1"
                            onClick={changeName}
                        >
                            Save
                        </button>
                    </span>
                    <span className="p-1 flex flex-col">
                        <label htmlFor="newAbout">About:</label>
                        <textarea
                            className="border-2 rounded-lg p-2 my-1 focus:border-black"
                            name="newAbout"
                            id="newAbout"
                            cols={35}
                            rows={10}
                            onChange={(e) => setNewAbout(e.target.value)}
                            value={newAbout}
                        />
                        <button
                            className="bg-black rounded-lg text-white px-2"
                            onClick={changeAbout}
                        >
                            Save
                        </button>
                        <button
                            className="border-black border-2 rounded-lg mt-1"
                            onClick={() => setIsEditProfile(false)}
                        >
                            Cancel
                        </button>
                    </span>
                </div>
            )}
            <span className="absolute top-0 right-0 m-1 p-1 text-2xl">
                <button onClick={() => setIsEditProfile(true)}>
                    <IoCreateOutline />
                </button>
                <button onClick={logOut}>
                    <IoExit />
                </button>
            </span>
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
