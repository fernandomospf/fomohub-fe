import { StatusType } from "./type";

export const Status = ({ status = "online" }: { status?: StatusType }) => {
    const colorClass = status === "online" ? "bg-green-500" : status === "offline" ? "bg-red-500" : "bg-yellow-500";
    const isOnline = status === "online";
    
    return (
        <>
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
                ${isOnline ? 'animate-pulse-slow shadow-[0_0_8px_rgba(34,197,94,0.8)]' : ''}
            `} />
            <style>{`
                .animate-pulse-slow {
                    animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
            `}</style>
        </>
    )
}