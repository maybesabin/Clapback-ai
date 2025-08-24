"use client"

import { createContext, SetStateAction, useContext, useState, useEffect, useCallback } from "react";

interface GlobalProps {
    prompt: string;
    setPrompt: React.Dispatch<SetStateAction<string>>;
    response: string;
    setResponse: React.Dispatch<SetStateAction<string>>;
    responseMode: "roast" | "refine" | null;
    setResponseMode: React.Dispatch<SetStateAction<"roast" | "refine" | null>>;
    responseCount: number;
    setResponseCount: React.Dispatch<SetStateAction<number>>;
}

const GlobalContext = createContext<undefined | GlobalProps>(undefined)

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState('')
    const [responseMode, setResponseMode] = useState<"roast" | "refine" | null>(null)
    const [responseCount, setResponseCount] = useState(0)

    // Load response count from localStorage only once on mount
    useEffect(() => {
        const saved = localStorage.getItem('clapback-response-count')
        if (saved) {
            try {
                const count = parseInt(saved) || 0
                setResponseCount(count)
            } catch (error) {
                console.error('Failed to parse localStorage data:', error)
                setResponseCount(0)
            }
        }
    }, [])

    // Save response count to localStorage only when it actually changes
    const updateResponseCount = useCallback((newCount: number | ((prev: number) => number)) => {
        setResponseCount(prev => {
            const actualNewCount = typeof newCount === 'function' ? newCount(prev) : newCount
            // Only save to localStorage if the count actually changed
            if (actualNewCount !== prev) {
                localStorage.setItem('clapback-response-count', actualNewCount.toString())
            }
            return actualNewCount
        })
    }, [])

    return (
        <GlobalContext.Provider value={{
            prompt,
            setPrompt,
            response,
            setResponse,
            responseMode,
            setResponseMode,
            responseCount,
            setResponseCount: updateResponseCount
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