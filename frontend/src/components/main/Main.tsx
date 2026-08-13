import { Book } from "./Book.tsx";
import {useBookNavigation} from "@/contexts/BookContext.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDown} from "lucide-react";

const Main = () => {
    const {version, setVersion} = useBookNavigation();
    const availableVersions = ["KJV"]
    const handleSelectedVersion = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setVersion(e.currentTarget.value)
    }
    return (
      <section className={"grid grid-cols-1 gap-4 place-items-center min-h-screen px-6"}>
        <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <Button variant="outline" className="h-12 flex-row font-bold text-4xl">
                            <span className="pb-3 pl-6 pr-3 fill-gray-500">{version}</span>
                            <ChevronDown className="size-6" />
                        </Button>} />
                    <DropdownMenuContent className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60" align="start">
                        {availableVersions.map((selectedVersion, index) => (
                            <DropdownMenuGroup key={index}>
                                <DropdownMenuItem>
                                    <button value={selectedVersion} className={"w-full"} id={"" + index} onClick={handleSelectedVersion}>{selectedVersion}</button>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
        <Book className="w-[60%]" />
        </section>
    );
};

export default Main;
