import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSummary } from "@/lib/gemini"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    // Generate new summary
    const newSummary = await generateSummary(note.content)

    // Update note with new summary
    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        summary: newSummary,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error("Error regenerating summary:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
