import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { chatAboutNote, chatGeneral } from "@/lib/gemini"
import { prisma } from "@/lib/prisma"
import type { Session } from "next-auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, noteId, noteContent, noteTitle, chatId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    let aiResponse: string

    try {
      if (noteId && noteContent && noteTitle) {
        // Chat about a specific note
        aiResponse = await chatAboutNote(noteContent, noteTitle, message)
      } else {
        // General chat
        aiResponse = await chatGeneral(message)
      }
    } catch (aiError) {
      console.error("AI API Error:", aiError)
      return NextResponse.json(
        { error: "Failed to generate AI response", details: aiError instanceof Error ? aiError.message : "Unknown error" },
        { status: 500 }
      )
    }

    // If chatId is provided, save both user message and AI response to the chat
    if (chatId) {
      try {
        // Verify the chat belongs to the user
        const chat = await prisma.chat.findFirst({
          where: {
            id: chatId,
            userId: session.user.id
          }
        })

        if (chat) {
          // Save user message
          await prisma.message.create({
            data: {
              content: message,
              role: "user",
              chatId: chatId
            }
          })

          // Save AI response
          await prisma.message.create({
            data: {
              content: aiResponse,
              role: "assistant",
              chatId: chatId
            }
          })

          // Update chat's updatedAt timestamp
          await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() }
          })
        }
      } catch (error) {
        console.error("Error saving messages to chat:", error)
        // Don't fail the request if saving fails
      }
    }

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}
