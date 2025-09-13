"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Edit, Trash2, RefreshCw, LogOut, User, MessageSquare, FileText } from "lucide-react"
import { toast } from "sonner"
import { ChatInterface } from "@/components/chat-interface"
import { NotesSidebar } from "@/components/notes-sidebar"

interface Note {
  id: string
  title: string
  content: string
  summary: string | null
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [viewMode, setViewMode] = useState<"chat" | "notes">("chat")
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchNotes()
    }
  }, [status, router])

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      toast.error("Failed to fetch notes")
    }
  }

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newNote = await response.json()
        setNotes([newNote, ...notes])
        setFormData({ title: "", content: "" })
        setIsCreateDialogOpen(false)
        toast.success("Note created successfully!")
      } else {
        toast.error("Failed to create note")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingNote) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          regenerateSummary: true
        }),
      })

      if (response.ok) {
        const updatedNote = await response.json()
        setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note))
        setEditingNote(null)
        setFormData({ title: "", content: "" })
        setIsEditDialogOpen(false)
        toast.success("Note updated successfully!")
      } else {
        toast.error("Failed to update note")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
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
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const handleRegenerateSummary = async (noteId: string) => {
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
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content
    })
    setIsEditDialogOpen(true)
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === "loading") {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animated-bg">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Thought Sort</h1>
                <p className="text-gray-300 text-sm">AI-powered note organization</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setViewMode("chat")}
                  variant={viewMode === "chat" ? "default" : "outline"}
                  className={viewMode === "chat" ? "glass bg-white/20 text-white border-white/30" : "glass border-white/20 text-white hover:bg-white/10"}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button
                  onClick={() => setViewMode("notes")}
                  variant={viewMode === "notes" ? "default" : "outline"}
                  className={viewMode === "notes" ? "glass bg-white/20 text-white border-white/30" : "glass border-white/20 text-white hover:bg-white/10"}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Notes
                </Button>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="glass border-white/20 text-white">
                  <User className="w-4 h-4 mr-2" />
                  {session?.user?.name || session?.user?.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card border-white/20">
                <DropdownMenuItem onClick={() => signOut()} className="text-white hover:bg-white/10">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {viewMode === "chat" ? (
          <>
            <NotesSidebar 
              onNoteSelect={setSelectedNote}
              selectedNoteId={selectedNote?.id}
              onNoteUpdate={(updatedNote) => {
                setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
                setSelectedNote(updatedNote)
              }}
            />
            <div className="flex-1">
              <ChatInterface 
                onNewNote={() => setIsCreateDialogOpen(true)} 
                selectedNote={selectedNote}
                onNoteUpdate={(updatedNote) => {
                  setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
                  setSelectedNote(updatedNote)
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">

              {/* Search and Create */}
              <div className="flex gap-4 mb-8">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="glass-input pl-10 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="glass bg-white/10 hover:bg-white/20 text-white border-white/20">
                      <Plus className="w-4 h-4 mr-2" />
                      New Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-white/20">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New Note</DialogTitle>
                      <DialogDescription className="text-gray-300">
                        Create a new note and let AI generate a summary for you.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateNote} className="space-y-4">
                      <div>
                        <label className="text-white text-sm font-medium">Title</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="glass-input text-white placeholder:text-gray-400 mt-1"
                          placeholder="Enter note title"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium">Content</label>
                        <Textarea
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          className="glass-input text-white placeholder:text-gray-400 mt-1"
                          placeholder="Write your thoughts here..."
                          rows={6}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                          className="border-white/20 text-white"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="glass bg-white/10 hover:bg-white/20 text-white border-white/20"
                        >
                          {isLoading ? "Creating..." : "Create Note"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => (
                  <Card key={note.id} className="glass-card border-white/20 hover:border-white/30 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{note.title}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-300 text-sm line-clamp-3">{note.content}</p>
                        </div>
                        {note.summary && (
                          <div className="glass p-3 rounded-lg">
                            <p className="text-white text-sm font-medium mb-1">AI Summary:</p>
                            <p className="text-gray-300 text-sm">{note.summary}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(note)}
                            className="flex-1 border-white/20 text-white hover:bg-white/10"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRegenerateSummary(note.id)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteNote(note.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredNotes.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-300 text-lg">No notes found. Create your first note to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-card border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Note</DialogTitle>
            <DialogDescription className="text-gray-300">
              Update your note and regenerate the AI summary.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditNote} className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="glass-input text-white placeholder:text-gray-400 mt-1"
                placeholder="Enter note title"
                required
              />
            </div>
            <div>
              <label className="text-white text-sm font-medium">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="glass-input text-white placeholder:text-gray-400 mt-1"
                placeholder="Write your thoughts here..."
                rows={6}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-white/20 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="glass bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                {isLoading ? "Updating..." : "Update Note"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
