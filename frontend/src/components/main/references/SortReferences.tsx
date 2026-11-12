import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"
interface Props {
    sortValue: string;
    setSortValue: (sortValue: string) => void;
}
export function SortReferences({sortValue, setSortValue}: Props) {
    return (
        <NativeSelect className={"h-8"}  value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
            <NativeSelectOption className={""} value="">Status: All</NativeSelectOption>
            <NativeSelectOption value="top-voted">Top Voted</NativeSelectOption>
        </NativeSelect>
    )
}
