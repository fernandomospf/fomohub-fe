import { StatusType } from "../status/type";

export type ProfileCircleProps = {
    children?: React.ReactNode;
    picture?: string;
    size?: number;
    username?: string;
    status?: StatusType;
}