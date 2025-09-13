import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Session } from "next-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get("noteId")

    const chats = await prisma.chat.findMany({
      where: {
        userId: session.user.id,
        ...(noteId && { noteId })
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        },
        note: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json(chats)
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, noteId } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const chat = await prisma.chat.create({
      data: {
        title,
        noteId: noteId || null,
        userId: session.user.id
      },
      include: {
        messages: true,
        note: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json(chat)
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
