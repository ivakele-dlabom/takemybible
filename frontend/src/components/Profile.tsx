import {useAuth} from "@/contexts/AuthContext.tsx";

export const Profile = () => {
    const {user} = useAuth();
    return (
        <button className={"absolute flex justify-center items-center bg-black top-4 right-4 size-10 rounded-full"}>
            <span className={"uppercase text-white font-bold"}>{user?.username.at(0)}</span>
        </button>
    )
}
