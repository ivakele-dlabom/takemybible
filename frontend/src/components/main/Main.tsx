import { BookDisplay } from "./BookDisplay.tsx";
import { useBookNavigation } from "@/contexts/BookContext.tsx";

const Main = () => {
  const { translation, setTranslation } = useBookNavigation();
  const availableVersions = ["KJV"];

  return (
    <section className="grid grid-cols-1 gap-4 place-items-center min-h-screen px-6">
      {/*
        Select translation version dropdown
        */}
      <label className="inline-flex items-center">
        <span className="sr-only">Bible version</span>
        <select
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className="h-12 rounded-md border border-gray-300 px-6 font-bold text-4xl"
        >
          {availableVersions.map((v) => (
            <option key={v} value={v} className="uppercase">
              {v}
            </option>
          ))}
        </select>
      </label>
      <BookDisplay className="w-[60%]" />
    </section>
  );
};

export default Main;
