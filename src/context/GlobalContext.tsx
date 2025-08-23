"use client"

import { createContext, SetStateAction, useContext, useState } from "react";

interface GlobalProps {
    prompt: string;
    setPrompt: React.Dispatch<SetStateAction<string>>;
    response: string;
    setResponse: React.Dispatch<SetStateAction<string>>;
    responseMode: "roast" | "refine" | null;
    setResponseMode: React.Dispatch<SetStateAction<"roast" | "refine" | null>>;
}

const GlobalContext = createContext<undefined | GlobalProps>(undefined)

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState('')
    const [responseMode, setResponseMode] = useState<"roast" | "refine" | null>(null)
    return (
        <GlobalContext.Provider value={{
            prompt,
            setPrompt,
            response,
            setResponse,
            responseMode,
            setResponseMode
        }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    const context = useContext(GlobalContext)
    if (!context) {
        throw Error("useGlobalContext must be used within global provider")
    }
    return context
}