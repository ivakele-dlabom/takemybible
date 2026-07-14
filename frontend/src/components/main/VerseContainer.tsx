import type {ReactNode} from "react";

interface Props {
    children: ReactNode
}
export const VerseContainer = ({children}: Props) => {
    return (
        <div className={""}>{children}</div>
    )
}
