import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateSummary(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `Please provide a concise summary of the following text. Focus on the main points and key insights. Keep it under 200 words:

${content}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating summary:", error)
    throw new Error("Failed to generate summary")
  }
}
