import Image from "next/image";
import { ProfileCircleProps } from "./type";

const getInitials = (name?: string) => {
    if (!name) return "";
    const names = name.trim().split(/\s+/);
    if (names.length > 1) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
}

export const ProfileCircle = ({ children, picture, username, size = 40, status = "online" }: ProfileCircleProps) => {
    const statusColors = {
        online: {
            color: '#22c55e',
            glow: 'rgba(34, 197, 94, 0.5)',
            animate: true
        },
        away: {
            color: '#eab308',
            glow: 'rgba(234, 179, 8, 0.3)',
            animate: false
        },
        offline: {
            color: '#ef4444',
            glow: 'rgba(239, 68, 68, 0.3)',
            animate: false
        }
    };

    const currentStatus = statusColors[status] || statusColors.online;

    return (
        <div className="relative inline-block">
            <div
                className="absolute -inset-1 rounded-full border-2 transition-colors duration-300"
                style={{
                    borderColor: currentStatus.color,
                    animation: currentStatus.animate ? 'glow-pulse 1.5s ease-in-out infinite' : 'none',
                    boxShadow: !currentStatus.animate ? `0 0 4px 1px ${currentStatus.glow}` : 'none'
                }}
            />
            <style>{`
                @keyframes glow-pulse {
                    0%, 100% { opacity: 1; box-shadow: 0 0 6px 2px ${currentStatus.glow}; }
                    50% { opacity: 0.4; box-shadow: 0 0 0px 0px transparent; }
                }
            `}</style>
            {
                picture ? (
                    <Image
                        src={picture}
                        alt="Profile"
                        width={size}
                        height={size}
                        className="rounded-full relative z-10"
                    />
                ) : (
                    <div
                        className="rounded-full relative z-10 flex items-center justify-center"
                        style={{
                            width: size,
                            height: size,
                            backgroundColor: '#7c3aed',
                        }}
                    >
                        <span className="text-white font-bold">{getInitials(username)}</span>
                    </div>
                )
            }
            {children}
        </div>
    );
};