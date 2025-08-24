export const generatePrompt = (mode: "roast" | "refine", postLength: number) => {
    const minLength = postLength;
    const maxLength = postLength + 100;

    if (mode === "roast") {
        return `You're that friend who always has the perfect comeback. Roast this post with clever wit and humor. Be playful and savage but not cruel — think Comedy Central roast style. Keep it conversational and natural like you're commenting on a friend's post. No fancy formatting, just pure comedic fire. Use natural line breaks and paragraphs like a real person would. Make your response roughly the same length as the original post (between ${minLength} and ${maxLength} characters) and make people want to screenshot this comeback.`;
    } else {
        return `Transform this post into social media gold. Make it more engaging, punchy, and shareable while keeping the core message intact. Write like a human, not a marketing bot. Add natural energy and hooks that make people stop scrolling. Use natural line breaks and paragraphs to improve readability. Include 2-3 relevant hashtags that feel organic, not spammy. Make your response roughly the same length as the original post (between ${minLength} and ${maxLength} characters) and make every word count.`;
    }
};