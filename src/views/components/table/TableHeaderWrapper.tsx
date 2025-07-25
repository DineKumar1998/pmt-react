import type React from "react";

type Props = {
    children: React.ReactNode;
}

export const TableHeaderWrapper: React.FunctionComponent<Props> = (props: Props) => {
    return <div className="table-header">
        {props.children}
    </div>
}