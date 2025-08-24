import { easeInOut } from "motion";

export const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { ease: easeInOut }
}