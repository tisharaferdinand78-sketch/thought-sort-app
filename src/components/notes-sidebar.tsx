"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, RefreshCw, MessageSquare, FileText } from "lucide-react"
import { toast } from "sonner"
import { Note, Chat } from "@/types"

interface NotesSidebarProps {
  onNoteSelect: (note: Note) => void
  onChatSelect: (chat: Chat) => void
  selectedNoteId?: string
  selectedChatId?: string
  onNoteUpdate?: (note: Note) => void
  onChatUpdate?: (chat: Chat) => void
}

export function NotesSidebar({ onNoteSelect, onChatSelect, selectedNoteId, selectedChatId, onNoteUpdate, onChatUpdate }: NotesSidebarProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"notes" | "chats">("notes")

  useEffect(() => {
    fetchNotes()
    fetchChats()
  }, [])

  useEffect(() => {
    if (onNoteUpdate) {
      // This will be called when a note is updated from the chat interface
      fetchNotes()
    }
  }, [onNoteUpdate])

  useEffect(() => {
    if (onChatUpdate) {
      // This will be called when a chat is updated
      fetchChats(selectedNoteId)
    }
  }, [onChatUpdate, selectedNoteId])

  useEffect(() => {
    // Fetch chats for the selected note when switching to chats view
    if (viewMode === "chats") {
      fetchChats(selectedNoteId)
    }
  }, [viewMode, selectedNoteId])

  // Auto-switch to notes mode if no note is selected and we're in chats mode
  useEffect(() => {
    if (!selectedNoteId && viewMode === "chats") {
      setViewMode("notes")
    }
  }, [selectedNoteId, viewMode])

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch {
      toast.error("Failed to fetch notes")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchChats = async (noteId?: string) => {
    try {
      const url = noteId ? `/api/chats?noteId=${noteId}` : "/api/chats"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setChats(data)
      }
    } catch {
      toast.error("Failed to fetch chats")
    }
  }

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setNotes(notes.filter(note => note.id !== noteId))
        toast.success("Note deleted successfully!")
      } else {
        toast.error("Failed to delete note")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const handleRegenerateSummary = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/notes/${noteId}/summary`, {
        method: "POST",
      })

      if (response.ok) {
        const updatedNote = await response.json()
        setNotes(notes.map(note => note.id === noteId ? updatedNote : note))
        toast.success("Summary regenerated successfully!")
      } else {
        toast.error("Failed to regenerate summary")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this chat?")) return

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setChats(chats.filter(chat => chat.id !== chatId))
        toast.success("Chat deleted successfully!")
      } else {
        toast.error("Failed to delete chat")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const handleCreateNewChat = async () => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Chat",
          noteId: selectedNoteId || null
        }),
      })

      if (response.ok) {
        const newChat = await response.json()
        setChats(prev => [newChat, ...prev])
        onChatSelect(newChat)
        toast.success("New chat created!")
      } else {
        toast.error("Failed to create chat")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(message => 
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className={`w-80 bg-black/20 backdrop-blur-xl border-r flex flex-col transition-all duration-300 ${
      viewMode === "notes" 
        ? "border-white/10" 
        : "border-purple-500/30 shadow-lg shadow-purple-500/10"
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">
            {viewMode === "notes" ? "Your Notes" : 
             selectedNoteId ? `Chats for Selected Note` : "Your Chats"}
          </h2>
          <Button
            onClick={viewMode === "notes" ? () => window.location.reload() : handleCreateNewChat}
            size="sm"
            className="glass bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => setViewMode("notes")}
            variant={viewMode === "notes" ? "default" : "outline"}
            size="sm"
            className={`${selectedNoteId ? "flex-1" : "w-full"} transition-all duration-300 ${
              viewMode === "notes" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/30 transform scale-105 font-medium" 
                : "glass border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white hover:scale-102"
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Notes
          </Button>
          {selectedNoteId && (
            <Button
              onClick={() => setViewMode("chats")}
              variant={viewMode === "chats" ? "default" : "outline"}
              size="sm"
              className={`flex-1 transition-all duration-300 ${
                viewMode === "chats" 
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/30 transform scale-105 font-medium" 
                  : "glass border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white hover:scale-102"
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chats
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={viewMode === "notes" ? "Search notes..." : "Search chats..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input pl-10 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading {viewMode}...</div>
          </div>
        ) : viewMode === "notes" ? (
          filteredNotes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">No notes found</div>
              <div className="text-gray-500 text-sm">Create your first note to get started</div>
            </div>
          ) : (
            filteredNotes.map((note) => (
            <Card
              key={note.id}
              className={`glass-card border-white/20 cursor-pointer transition-all duration-200 hover:border-white/30 ${
                selectedNoteId === note.id ? "border-blue-500/50 bg-blue-500/10" : ""
              }`}
              onClick={() => {
                onNoteSelect(note)
                setViewMode("chats") // Auto-switch to chats tab when a note is selected
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-white text-sm font-medium line-clamp-2">
                    {note.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-white/20">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle edit
                        }}
                        className="text-white hover:bg-white/10"
                      >
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleRegenerateSummary(note.id, e)}
                        className="text-white hover:bg-white/10"
                      >
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Regenerate Summary
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="text-gray-400 text-xs">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 text-xs line-clamp-3 mb-2">
                  {note.content}
                </p>
                {note.summary && (
                  <div className="glass p-2 rounded text-xs">
                    <p className="text-white font-medium mb-1">AI Summary:</p>
                    <p className="text-gray-300 line-clamp-2">{note.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )
        ) : (
          <>
            {/* Show current note title when viewing chats for a specific note */}
            {selectedNoteId && (
              <div className="mb-4 p-3 glass rounded-lg border border-blue-500/30 bg-blue-500/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-blue-300 text-xs font-medium uppercase tracking-wide">Current Note</div>
                    <div className="text-white text-sm font-medium line-clamp-2">
                      {notes.find(note => note.id === selectedNoteId)?.title || "Unknown Note"}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {filteredChats.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">No chats found</div>
                <div className="text-gray-500 text-sm">
                  {selectedNoteId ? "No chats for this note yet" : "Create your first chat to get started"}
                </div>
              </div>
            ) : (
              filteredChats.map((chat) => (
              <Card
                key={chat.id}
                className={`glass-card border-white/20 cursor-pointer transition-all duration-200 hover:border-white/30 ${
                  selectedChatId === chat.id ? "border-blue-500/50 bg-blue-500/10" : ""
                }`}
                onClick={() => onChatSelect(chat)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-sm font-medium line-clamp-2">
                      {chat.title}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card border-white/20">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle edit chat title
                          }}
                          className="text-white hover:bg-white/10"
                        >
                          <Edit className="w-3 h-3 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="text-gray-400 text-xs">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                    {chat.note && (
                      <span className="ml-2 text-blue-400">• {chat.note.title}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-gray-300 text-xs mb-2">
                    {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                  </div>
                  {chat.messages.length > 0 && (
                    <div className="glass p-2 rounded text-xs">
                      <p className="text-gray-300 line-clamp-2">
                        {chat.messages[chat.messages.length - 1].content}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
            )}
          </>
        )}
      </div>
    </div>
  )
}
