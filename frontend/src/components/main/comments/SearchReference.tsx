import {Search} from "lucide-react";

export const SearchReference = () => {
    const onSubmit = (e:  React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    return (
        <form className="flex flex-row  border border-gray-300 rounded-md p-2 gap-2 w-70" role="search" onSubmit={onSubmit}>

            <button type="submit">
                <Search className={"size-4"} color="#C4C1C0"/>
            </button>
            <input
                type="search"
                name="references"
                placeholder="Search references or themes..."
                aria-label="Search"
                autoComplete="off"
                className={"w-full border-none focus:outline-none focus:ring-0"}
            />
        </form>
    )
}
