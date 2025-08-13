import type { FC } from "react";
import Badges from "../badges";
import { ClientTypes } from "@/utils/constants";

type Props = {
    type: string;
}

export const MemebrType: FC<Props> = ({ type }) => {
    if (type === ClientTypes[0]) {
        return <Badges.Danger>{ClientTypes[0]}</Badges.Danger>;
    } else if (type === ClientTypes[1]) {
        return <Badges.Success>{ClientTypes[1]}</Badges.Success>;
    } else if (type === ClientTypes[2]) {
        return <Badges.Warning>{ClientTypes[2]}</Badges.Warning>;
    }
    return "--"
}