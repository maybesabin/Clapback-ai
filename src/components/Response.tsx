"use client"

import { Copy, Twitter } from "lucide-react"
import { Button } from "./ui/button"
import { useGlobalContext } from "@/context/GlobalContext"
import { toast } from "sonner"

const Response = () => {
    const { response, responseMode } = useGlobalContext()
    if (!response) return null;

    const isRefined = responseMode === "refine"

    const handleTweet = () => {
        const tweetText = encodeURIComponent(response)
        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
        window.open(twitterUrl, '_blank')
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(response)
            toast.success("Copied to clipboard!")
        } catch (error) {
            console.error('Failed to copy text:', error)
        }
    }

    return (
        <div className={`mt-2 w-full border-l rounded-2xl p-4 bg-neutral-900/20 ${isRefined ? 'border-green-600' : 'border-red-800'
            }`}>
            <h4 className="text-xs text-neutral-400">
                {isRefined ? '🟢 Refined' : '🔴 Roasted'}
            </h4>
            <p className="md:text-sm text-xs mt-2 text-neutral-200">
                {response}
            </p>
            <div className="flex items-center gap-2 mt-4">
                <Button
                    onClick={handleCopy}
                    size={"sm"}
                    className="bg-neutral-950 border hover:bg-neutral-900 rounded-[0.5rem] text-xs text-white"
                >
                    <Copy />
                    <span>Copy</span>
                </Button>
                <Button
                    onClick={handleTweet}
                    size={"sm"}
                    className="bg-neutral-950 border hover:bg-neutral-900 rounded-[0.5rem] text-xs text-white"
                >
                    <Twitter />
                    <span>Tweet</span>
                </Button>
            </div>
        </div>
    )
}

export default Response