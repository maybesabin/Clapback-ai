"use client"

import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useGlobalContext } from "@/context/GlobalContext"
import { useState } from "react"
import { generatePrompt } from "@/data/prompts"
import { toast } from "sonner"
import fireEmoji from "../assets/fire-emoji.png"
import heartEmoji from "../assets/heart-emoji.png"
import Image from "next/image"
import axios from "axios"
import { motion } from "motion/react"
import { fadeIn } from "@/utils/animations"

const Chat = () => {
    const { prompt, setPrompt, setResponse, setResponseMode, responseCount, setResponseCount } = useGlobalContext()
    const [loadingMode, setLoadingMode] = useState<"roast" | "refine" | null>(null)

    const getResponse = async (mode: "roast" | "refine") => {
        if (!prompt) return

        // Check response limit
        if (responseCount >= 10) {
            toast.error("Response limit reached!", {
                description: "You've used all 10 available responses. The app is now restricted.",
                duration: 5000,
            })
            return
        }

        setLoadingMode(mode)

        try {
            const promptText = generatePrompt(mode, prompt.length)
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

            const remainingResponses = 9 - responseCount
            setResponseCount(prev => prev + 1)
            setResponse(res.data.candidates[0]?.content?.parts[0]?.text)
            setResponseMode(mode)

            // Show toast messages for remaining responses
            if (remainingResponses === 9) {
                toast.info("First response generated!", {
                    description: `You only have ${remainingResponses} messages left.`,
                    duration: 4000,
                })
            } else if (remainingResponses <= 3 && remainingResponses > 0) {
                toast.warning("Running low on responses!", {
                    description: `You only have ${remainingResponses} messages left.`,
                    duration: 4000,
                })
            }
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

    return (
        <>
            <motion.div
                className="w-full"
                initial={fadeIn.initial}
                animate={fadeIn.animate}
                transition={{
                    ...fadeIn.transition,
                    duration: 0.3,
                    delay: 1,
                }}
            >
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{ resize: "none" }}
                    placeholder="Place your social media post here..."
                    className="border-none w-full h-40 mt-2 rounded-2xl bg-neutral-900 placeholder:text-neutral-600 overflow-y-auto px-4 py-2.5 md:text-sm text-xs"
                />
            </motion.div>

            <motion.div
                className="w-full flex items-center gap-4"
                initial={fadeIn.initial}
                animate={fadeIn.animate}
                transition={{
                    ...fadeIn.transition,
                    duration: 0.3,
                    delay: 1,
                }}
            >
                <Button
                    onClick={() => getResponse("roast")}
                    disabled={!prompt || loadingMode === "roast" || responseCount >= 10}
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
                    disabled={!prompt || loadingMode === "refine" || responseCount >= 10}
                    variant={"secondary"}
                    className="bg-gradient-to-r from-[#1e293b] via-[#4c1d95] to-[#7e22ce] hover:scale-[102%] cursor-pointer flex-1 flex items-center gap-2 rounded-[0.7rem] py-6 md:text-base text-sm transition-all duration-200"
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
            </motion.div>
        </>
    )
}

export default Chat