
import { createContext, useContext, useState } from "react";



interface ModalContextType {
    crossReferenceModalOpen: boolean;
    setCrossReferenceModalOpen: (value: boolean) => void;

}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [crossReferenceModalOpen, setCrossReferenceModalOpen] = useState<boolean>(false);

    return (
        <ModalContext.Provider
            value={{crossReferenceModalOpen, setCrossReferenceModalOpen: setCrossReferenceModalOpen}}
        >
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}
