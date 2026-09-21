import CrossReferences from "./CrossReferences";

interface Props {
}
export const VerseFeed = ({}: Props) => {
    return (
        <section className="w-150 bg-white ">
            <div className={"flex flex-row items-center mx-auto w-fit"}>
                <button className={"hover:cursor-pointer font-medium p-2"}>Comments</button>
                <div className="w-px h-4 bg-gray-300 mx-4"></div>
                <button className={"hover:cursor-pointer font-medium p-2"}>Cross references</button>
            </div>
            <div className="w-full h-px bg-gray-300 my-4"></div>
            {/*<Comments/>*/}
            <CrossReferences/>


        </section>
    )
}
