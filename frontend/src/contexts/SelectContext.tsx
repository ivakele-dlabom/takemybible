
import { createContext, useContext, useState } from "react";



interface SelectContextType {
  translation: string;
  setTranslation: (translation: string) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

export function SelectProvider({ children }: { children: React.ReactNode }) {
  const [translation, setTranslation] = useState<string>("kjv");

  return (
    <SelectContext.Provider
      value={{ translation, setTranslation }}
    >
      {children}
    </SelectContext.Provider>
  );
}

export function useSelect() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("useSelect must be used within a SelectProvider");
  }
  return context;
}
