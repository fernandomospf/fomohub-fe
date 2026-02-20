import { StatusType } from "./type";

export const Status = ({ status = "online" }: { status?: StatusType }) => {
    const colorClass = status === "online" ? "bg-green-500" : status === "offline" ? "bg-red-500" : "bg-yellow-500";
    return (
        <div className={`
            absolute 
            bottom-0 
            right-0 
            w-3 
            h-3 
            ${colorClass}
            rounded-full 
            border-2 
            border-white 
            z-10
        `} />
    )
}