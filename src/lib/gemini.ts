import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateSummary(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `Please provide a concise summary of the following text. Focus on the main points and key insights. Keep it under 200 words:

${content}`

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Summary generation timeout")), 15000)
    })

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]) as any

    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating summary:", error)
    throw new Error("Failed to generate summary")
  }
}

export async function generateIcon(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `Based on the following text content, suggest a single modern emoji icon that best represents the specific content and theme. Choose from modern, outline-style emojis that are clean and minimalist. Focus on the unique aspects of this specific note content. Only respond with the emoji, nothing else.

Text: ${content}`

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Icon generation timeout")), 10000)
    })

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]) as any

    const response = await result.response
    const icon = response.text().trim()
    
    // Validate that it's a single emoji (basic check)
    if (icon.length <= 4 && icon.length > 0) {
      return icon
    } else {
      // Fallback to a default modern icon if AI returns something unexpected
      return "📄"
    }
  } catch (error) {
    console.error("Error generating icon:", error)
    return "📄" // Default fallback icon
  }
}
