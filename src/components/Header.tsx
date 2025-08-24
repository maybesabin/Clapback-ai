"use client"

import { motion } from "motion/react"
import { fadeIn } from "@/utils/animations"

const Header = () => {
    return (
        <>
            <motion.h1
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent"
                initial={fadeIn.initial}
                animate={fadeIn.animate}
                transition={{
                    ...fadeIn.transition,
                    duration: 0.3,
                    delay: 0,
                }}
            >
                Clapback AI
            </motion.h1>
            <motion.p
                className="text-neutral-400 text-base"
                initial={fadeIn.initial}
                animate={fadeIn.animate}
                transition={{
                    ...fadeIn.transition,
                    duration: 0.3,
                    delay: 0.5,
                }}>
                Roast it. Refine it. Rule the feed.
            </motion.p>
        </>
    )
}

export default Header