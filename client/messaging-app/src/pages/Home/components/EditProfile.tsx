import { useEffect, useState } from "react";
import { User } from "../../../context/AuthContext";
import apiFetch from "../../../utils/apiFetch";

type Props = {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User>> | undefined;
    setIsEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditProfile({ user, setUser, setIsEditProfile }: Props) {
    const [newUsername, setNewUsername] = useState("");
    const [newAbout, setNewAbout] = useState("");

    useEffect(() => {
        setNewUsername(user?.username || "");
        setNewAbout(user?.about || "");

        return;
    }, [user]);

    const changeName = async () => {
        const res = await apiFetch("/users/changeUsername", "POST", {
            newUsername,
        });

        if (res.ok) {
            setUser?.((prev) => ({ ...prev, username: newUsername }));
            setIsEditProfile(false);
        } else {
            setNewUsername(user?.username || "");
            window.alert(
                "Username could not be changed. The username might not be available."
            );
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
        <div
            className="fixed top-0 left-0 flex justify-center items-center z-50 w-screen h-screen m-0 p-0 bg-black bg-opacity-80"
            onClick={() => setIsEditProfile(false)}
        >
            <div
                className="flex flex-col justify-center items-start rounded-lg max-w-[90%] md:max-w-1/2 h-fit bg-white p-4"
                onClick={(e) => e.stopPropagation()}
            >
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
                        className="bg-black rounded-lg text-white px-2 py-1 my-1"
                        onClick={changeName}
                    >
                        Rename
                    </button>
                </span>
                <span className="p-1 flex flex-col">
                    <label htmlFor="newAbout">About:</label>
                    <textarea
                        className="border-2 rounded-lg p-2 my-1 focus:border-black w-full"
                        name="newAbout"
                        id="newAbout"
                        cols={80}
                        rows={10}
                        onChange={(e) => setNewAbout(e.target.value)}
                        value={newAbout}
                    />
                    <button
                        className="bg-black rounded-lg text-white px-2 py-1"
                        onClick={changeAbout}
                    >
                        Change About
                    </button>
                    <button
                        className="border-black border-2 rounded-lg mt-1"
                        onClick={() => setIsEditProfile(false)}
                    >
                        Close
                    </button>
                </span>
            </div>
        </div>
    );
}

export default EditProfile;