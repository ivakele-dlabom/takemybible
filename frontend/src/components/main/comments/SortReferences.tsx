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
        <NativeSelect  value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
            <NativeSelectOption className={"h-10"} value="">Select status</NativeSelectOption>
            <NativeSelectOption value="top-voted">Top Voted</NativeSelectOption>
        </NativeSelect>
    )
}
