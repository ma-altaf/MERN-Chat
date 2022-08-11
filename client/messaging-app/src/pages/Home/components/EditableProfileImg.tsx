import defaultPPImg from "../../../assets/defaultPP.jpg";
import { ChangeEvent, useContext, useState } from "react";
import { authcontext, User } from "../../../context/AuthContext";
import apiFetch from "../../../utils/apiFetch";

function EditableProfileImg() {
    const [user, setUser] = useContext(authcontext);
    const [isUploadingImg, setIsUploadingImg] = useState(false);

    const UploadProfilePic = (e: ChangeEvent<HTMLInputElement>) => {
        const newProfilePic = e.target.files?.[0];
        if (!newProfilePic) {
            // no image selected
            return;
        }

        setIsUploadingImg(true);

        const newProfileImg = new FileReader();
        newProfileImg.readAsDataURL(newProfilePic);

        newProfileImg.onloadend = async () => {
            try {
                const response = await apiFetch(
                    "/users/changeProfilePic",
                    "POST",
                    {
                        image: newProfileImg.result,
                    }
                );

                if (response.ok) {
                    const auth = await apiFetch("/users/getUser");
                    if (auth.ok) {
                        const userData: User = await auth.json();
                        setUser?.(userData);
                    }
                }
            } catch (error) {
                console.log("error:", error);
                setIsUploadingImg(false);
            }
        };
    };

    return (
        <>
            <label
                htmlFor="uploadProfilePic"
                title="Click to change profile picture"
                className="relative rounded-full overflow-hidden mx-auto"
            >
                {isUploadingImg && (
                    <div className="bg-accent-base w-full h-full absolute text-white flex justify-center items-center uppercase">
                        changing
                    </div>
                )}

                <img
                    className="w-40 rounded-full aspect-square object-cover cursor-pointer"
                    src={user?.avatarURL || defaultPPImg}
                    alt="current user"
                    onLoad={() => setIsUploadingImg(false)}
                />
            </label>

            <input
                type="file"
                accept="image/*"
                name="uploadProfilePic"
                id="uploadProfilePic"
                className="hidden"
                onChange={(e) => UploadProfilePic(e)}
            />
        </>
    );
}

export default EditableProfileImg;
