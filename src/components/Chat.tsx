"use client"

import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import fireEmoji from "../assets/fire-emoji.png"
import heartEmoji from "../assets/heart-emoji.png"
import Image from "next/image"
import axios from "axios"
import { useGlobalContext } from "@/context/GlobalContext"
import { useState, useEffect } from "react"
import { generatePrompt } from "@/data/prompts"
import { toast } from "sonner"

const Chat = () => {
    const { prompt, setPrompt, setResponse, setResponseMode } = useGlobalContext()
    const [loadingMode, setLoadingMode] = useState<"roast" | "refine" | null>(null)
    const [promptUsage, setPromptUsage] = useState<Record<string, number>>({})
    const [lastPrompt, setLastPrompt] = useState<string>("")

    // Load prompt usage from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('clapback-prompt-usage')
        if (saved) {
            try {
                setPromptUsage(JSON.parse(saved))
            } catch (error) {
                console.error('Failed to parse localStorage data:', error)
            }
        }
    }, [])

    // Save prompt usage to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('clapback-prompt-usage', JSON.stringify(promptUsage))
    }, [promptUsage])

    // Check if prompt has changed and reset usage if it's a new prompt
    useEffect(() => {
        if (prompt !== lastPrompt && prompt !== "") {
            setLastPrompt(prompt)
        }
    }, [prompt, lastPrompt])

    const getResponse = async (mode: "roast" | "refine") => {
        if (!prompt) return

        // Check if this prompt has been used 3 or more times
        const currentUsage = promptUsage[prompt] || 0

        if (currentUsage >= 3) {
            toast.error("Generation limit reached!", {
                description: "You've already generated 3 responses for this prompt. Try a different text.",
                duration: 5000,
            })
            return
        }

        setLoadingMode(mode)

        try {
            const promptText = generatePrompt(mode)
            const res = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `${promptText}\n\n${prompt}`
                                }
                            ]
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Increment usage count for this prompt
            setPromptUsage(prev => ({
                ...prev,
                [prompt]: (prev[prompt] || 0) + 1
            }))

            setResponse(res.data.candidates[0]?.content?.parts[0]?.text)
            setResponseMode(mode)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!", {
                description: "Failed to generate response. Please try again.",
                duration: 4000,
            })
        } finally {
            setLoadingMode(null)
        }
    }

    // Get current usage count for display
    const getCurrentUsage = () => {
        if (!prompt) return 0
        return promptUsage[prompt] || 0
    }

    return (
        <>
            <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{ resize: "none" }}
                placeholder="Place your social media post here..."
                className="border-none w-full h-40 mt-2 rounded-2xl bg-neutral-900 placeholder:text-neutral-600 overflow-y-auto px-4 py-2.5 md:text-sm text-xs"
            />

            {/* Usage counter */}
            {prompt && (
                <div className="text-xs text-neutral-500">
                    <span>Generations used: {getCurrentUsage()}/3</span>
                </div>
            )}

            <div className="w-full flex items-center gap-4">
                <Button
                    onClick={() => getResponse("roast")}
                    disabled={!prompt || loadingMode === "roast" || getCurrentUsage() >= 3}
                    variant={"secondary"}
                    className="bg-gradient-to-r from-[#7f1d1d] via-[#9a3412] to-[#b45309] hover:scale-[102%] cursor-pointer flex-1 flex items-center gap-2 rounded-[0.7rem] py-6 md:text-base text-sm transition-all duration-200"
                >
                    <Image
                        className="md:size-4 size-3"
                        src={fireEmoji}
                        height={660}
                        width={600}
                        alt="Iphone Fire Emoji no background"
                    />
                    <span>{loadingMode === "roast" ? "Roasting..." : "Roast It"}</span>
                </Button>
                <Button
                    onClick={() => getResponse("refine")}
                    disabled={!prompt || loadingMode === "refine" || getCurrentUsage() >= 3}
                    variant={"secondary"}
                    className="bg-gradient-to-l from-[#1e293b] via-[#4c1d95] to-[#7e22ce] hover:scale-[102%] cursor-pointer flex-1 flex items-center gap-2 rounded-[0.7rem] py-6 md:text-base text-sm transition-all duration-200"
                >
                    <Image
                        className="md:size-4 size-3"
                        src={heartEmoji}
                        height={660}
                        width={600}
                        alt="Iphone Heart Glitter Emoji no background"
                    />
                    <span>{loadingMode === "refine" ? "Refining..." : "Refine It"}</span>
                </Button>
            </div>
        </>
    )
}

export default Chat