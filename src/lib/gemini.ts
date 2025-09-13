import { GoogleGenerativeAI } from "@google/generative-ai"
import { getIconForContent } from "./icon-mapping"

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
    // Use local mapping first for consistency and speed
    const localIcon = getIconForContent(content)
    if (localIcon && localIcon !== 'FileText') {
      return localIcon
    }

    // Fallback to AI for more specific cases
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `Based on the following text content, suggest a Lucide React icon name that best represents the specific content. Choose from common Lucide icons like: Briefcase, Lightbulb, Book, Target, Users, Code, Heart, Plane, etc. Only respond with the icon name, nothing else.

Text: ${content}`

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Icon generation timeout")), 5000)
    })

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]) as any

    const response = await result.response
    const iconName = response.text().trim()
    
    // Validate that it's a reasonable icon name
    if (iconName && iconName.length > 2 && iconName.length < 20) {
      return iconName
    } else {
      return "FileText" // Default fallback icon
    }
  } catch (error) {
    console.error("Error generating icon:", error)
    return "FileText" // Default fallback icon
  }
}
