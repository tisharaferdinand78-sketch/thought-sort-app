import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSummary, generateIcon } from "@/lib/gemini"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/notes - Starting note creation")
    
    const session = await getServerSession(authOptions)
    console.log("Session:", session ? "Found" : "Not found")
    
    if (!session?.user?.id) {
      console.log("No session or user ID found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Request body:", body)
    const { title, content } = body

    if (!title || !content) {
      console.log("Missing title or content:", { title: !!title, content: !!content })
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    console.log("Generating AI summary and icon...")
    // Generate AI summary and icon in parallel
    const [summary, icon] = await Promise.all([
      generateSummary(content),
      generateIcon(content)
    ])
    console.log("Summary generated:", summary ? "Success" : "Failed")
    console.log("Icon generated:", icon)

    console.log("Creating note in database...")
    const note = await prisma.note.create({
      data: {
        title,
        content,
        summary,
        icon,
        userId: session.user.id
      }
    })

    console.log("Note created successfully:", note.id)
    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Error creating note:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
