import { BookDisplay } from "./BookDisplay.tsx";
import { useBookNavigation } from "@/contexts/BookContext.tsx";

const Main = () => {
  const { translation, setTranslation } = useBookNavigation();
  const availableTranslation = ["KJV"];

  return (
    <section className="font-firacode grid grid-cols-1 gap-4  min-h-screen px-6">
      {/*
        Select translation version dropdown
        */}
      <label className="absolute z-10 inline-flex left-4 top-4 hover:cursor-pointer">
        <span className="sr-only">Bible translation</span>
        <select
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className="h-10 rounded-sm border border-gray-300 px-6 font-bold text-xl"
        >
          {availableTranslation .map((v) => (
            <option key={v} value={v} className="uppercase">
              {v}
            </option>
          ))}
        </select>
      </label>
      <BookDisplay className="w-full" />
    </section>
  );
};

export default Main;
