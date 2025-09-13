"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { DynamicIcon } from "./dynamic-icon"

interface Note {
  id: string
  title: string
  content: string
  summary: string | null
  icon: string | null
  createdAt: string
  updatedAt: string
}

interface NotesSidebarProps {
  onNoteSelect: (note: Note) => void
  selectedNoteId?: string
  onNoteUpdate?: (note: Note) => void
}

export function NotesSidebar({ onNoteSelect, selectedNoteId, onNoteUpdate }: NotesSidebarProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [])

  useEffect(() => {
    if (onNoteUpdate) {
      // This will be called when a note is updated from the chat interface
      fetchNotes()
    }
  }, [onNoteUpdate])

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      toast.error("Failed to fetch notes")
    } finally {
      setIsLoading(false)
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
    } catch (error) {
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
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Your Notes</h2>
          <Button
            onClick={() => window.location.reload()}
            size="sm"
            className="glass bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
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

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading notes...</div>
          </div>
        ) : filteredNotes.length === 0 ? (
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
              onClick={() => onNoteSelect(note)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <DynamicIcon 
                      name={note.icon || "FileText"} 
                      size={18} 
                      className="text-white flex-shrink-0" 
                    />
                    <CardTitle className="text-white text-sm font-medium line-clamp-2">
                      {note.title}
                    </CardTitle>
                  </div>
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
        )}
      </div>
    </div>
  )
}
