import { useNavigate, useSearchParams } from "react-router-dom";
import BackArrow from "./icons/BackArrow";
import { preserveQueryParams } from "@/utils/queryParams";

import "./components.scss";

type Props = {
    title?: string;
    backHandler?: () => void;
    backUrl?: string;
}

export const BackButton = (props: Props) => {
    const { title, backHandler, backUrl } = props;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const handler = () => {
        if (backHandler) {
            backHandler();
        } else if (backUrl) {
            const url = preserveQueryParams(backUrl, searchParams);
            navigate(url);
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
