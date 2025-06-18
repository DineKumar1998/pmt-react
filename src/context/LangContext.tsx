import React, { createContext, useContext, useState } from "react";

const LangContext = createContext<any>(null);

export const LangProvider = ({ children }: React.PropsWithChildren) => {
    const [selectedLang, setSelectedLang] = useState("en");

    return (
        <LangContext.Provider value={{ selectedLang, setSelectedLang }}>
            {children}
        </LangContext.Provider>
    );
};

export const useLang = () => useContext(LangContext);
