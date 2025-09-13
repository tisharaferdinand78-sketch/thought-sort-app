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

export async function chatAboutNote(noteContent: string, noteTitle: string, userMessage: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `You are an AI assistant helping someone discuss and explore their notes. Here's the note they want to talk about:

Title: ${noteTitle}

Content: ${noteContent}

User's question/message: ${userMessage}

Please provide a helpful, conversational response that:
1. Directly addresses their question or comment
2. References specific parts of the note when relevant
3. Offers insights, connections, or suggestions based on the note content
4. Keeps the tone friendly and supportive
5. Encourages further exploration of their thoughts

Respond in a natural, conversational way as if you're discussing the note with them.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating chat response:", error)
    throw new Error("Failed to generate chat response")
  }
}

export async function chatGeneral(userMessage: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `You are an AI assistant for Thought Sort, an app that helps overthinkers organize their thoughts into notes. The user is asking: "${userMessage}"

Please provide a helpful, friendly response that:
1. Directly addresses their question
2. Offers guidance on note-taking, organization, or thought management
3. Encourages them to use the app to capture and organize their thoughts
4. Keeps the tone supportive and understanding of overthinking challenges

Be conversational and helpful.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating general chat response:", error)
    throw new Error("Failed to generate chat response")
  }
}
