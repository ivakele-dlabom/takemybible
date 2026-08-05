import type {ReactNode} from "react";

interface Props {
    children: ReactNode,
    className?: string
}
export const VerseContainer = ({className, children}: Props) => {
    return (
      <div className={" " + className}>{children}</div>
    )
}
