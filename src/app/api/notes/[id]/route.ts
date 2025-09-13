import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSummary } from "@/lib/gemini"

export async function GET(
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

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error fetching note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { title, content, regenerateSummary } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    let summary = existingNote.summary

    // Regenerate summary if requested or if content changed significantly
    if (regenerateSummary || content !== existingNote.content) {
      summary = await generateSummary(content)
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        summary,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error("Error updating note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await prisma.note.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
