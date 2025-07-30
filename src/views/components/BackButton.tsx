import { useNavigate } from "react-router-dom";
import BackArrow from "./icons/BackArrow";

import "./components.scss";

type Props = {
    title?: string;
    backHandler?: () => void;
}

export const BackButton = (props: Props) => {
    const { title, backHandler } = props;
    const navigate = useNavigate();
    
    const handler = () => {
        if (backHandler) {
            backHandler();
        } else {
            navigate(-1);
        }
    }

    return <button className="bb-container" onClick={handler} title="Back">
        <BackArrow width={24} height={24} />
        {
            title && <span className="bb-title">{title}</span>
        }
    </button>
}