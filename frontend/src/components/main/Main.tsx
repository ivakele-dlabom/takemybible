import { Book } from "./Book.tsx";

const Main = () => {
    return (
      <section className={"grid grid-cols-1 gap-4 place-items-center min-h-screen px-6"}>
        <button className="absolute left-4 font-bold top-4">
          KJV
        </button>
        <Book className="w-[60%]" />
        </section>
    );
};

export default Main;
