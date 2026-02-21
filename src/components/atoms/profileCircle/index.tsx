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

export const ProfileCircle = ({ children, picture, username, size = 40 }: ProfileCircleProps) => {
    return (
        <div className="relative inline-block">
            <div
                className="absolute -inset-1 rounded-full border-2 border-primary"
                style={{
                    animation: 'glow-pulse 1.5s ease-in-out infinite',
                }}
            />
            <style>{`
                @keyframes glow-pulse {
                    0%, 100% { opacity: 1; box-shadow: 0 0 6px 2px var(--color-primary, #7c3aed); }
                    50% { opacity: 0; box-shadow: 0 0 0px 0px transparent; }
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