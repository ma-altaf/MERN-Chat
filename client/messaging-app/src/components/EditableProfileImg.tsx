import defaultPPImg from "../assets/defaultPP.jpg";
import { useContext } from "react";
import { authcontext } from "../context/AuthContext";

function EditableProfileImg() {
    const [user] = useContext(authcontext);
    return (
        <img
            className="w-52 rounded-full aspect-square object-cover"
            src={user?.avatarURL || defaultPPImg}
            alt="current user"
        />
    );
}

export default EditableProfileImg;
