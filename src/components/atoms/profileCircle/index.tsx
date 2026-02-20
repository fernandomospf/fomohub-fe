import Image from "next/image";
import { ProfileCircleProps } from "./type";

export const ProfileCircle = ({ children, picture, size = 40 }: ProfileCircleProps) => {
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
            <Image
                src={picture}
                alt="Profile"
                width={size}
                height={size}
                className="rounded-full relative z-10"
            />
            {children}
        </div>
    );
};