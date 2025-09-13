"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Plus, Bot, User, Sparkles, Edit3, MessageSquare, Save, X } from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  noteId?: string
}

interface ChatInterfaceProps {
  onNewNote: () => void
  selectedNote: Note | null
  onNoteUpdate: (note: Note) => void
}

interface Note {
  id: string
  title: string
  content: string
  summary: string | null
  createdAt: string
  updatedAt: string
}

export function ChatInterface({ onNewNote, selectedNote, onNoteUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your AI assistant for Thought Sort. I can help you create, organize, and discuss your notes. What would you like to work on today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"chat" | "edit">("chat")
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteForm, setNoteForm] = useState({ title: "", content: "" })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedNote) {
      setEditingNote(selectedNote)
      setNoteForm({
        title: selectedNote.title,
        content: selectedNote.content
      })
      setViewMode("chat")
    }
  }, [selectedNote])

  const handleCreateNote = async () => {
    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      toast.error("Please fill in both title and content")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteForm),
      })

      if (response.ok) {
        const newNote = await response.json()
        onNoteUpdate(newNote)
        setNoteForm({ title: "", content: "" })
        setViewMode("chat")
        toast.success("Note created successfully!")
        
        // Add a message about the new note
        const noteMessage: Message = {
          id: Date.now().toString(),
          type: "assistant",
          content: `Great! I've created a new note "${newNote.title}" with an AI-generated summary. You can now chat about this note or switch to edit mode to modify it.`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, noteMessage])
      } else {
        toast.error("Failed to create note")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote || !noteForm.title.trim() || !noteForm.content.trim()) {
      toast.error("Please fill in both title and content")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...noteForm,
          regenerateSummary: true
        }),
      })

      if (response.ok) {
        const updatedNote = await response.json()
        onNoteUpdate(updatedNote)
        setEditingNote(updatedNote)
        setViewMode("chat")
        toast.success("Note updated successfully!")
        
        // Add a message about the update
        const updateMessage: Message = {
          id: Date.now().toString(),
          type: "assistant",
          content: `Perfect! I've updated "${updatedNote.title}" and regenerated the AI summary. You can continue chatting about this note or make further edits.`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, updateMessage])
      } else {
        toast.error("Failed to update note")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Simulate AI response (you can replace this with actual AI integration)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I understand you want to "${inputValue.trim()}". Let me help you with that. You can create a new note to capture your thoughts, or I can help you organize existing notes. What specific aspect would you like to focus on?`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      toast.error("Failed to get AI response")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">
              {selectedNote ? `Working with: ${selectedNote.title}` : "AI Assistant"}
            </h2>
            <p className="text-gray-400 text-sm">
              {selectedNote ? "Chat about this note or edit it" : "Ready to help with your notes"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedNote && (
            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode("chat")}
                variant={viewMode === "chat" ? "default" : "outline"}
                size="sm"
                className={viewMode === "chat" ? "glass bg-white/20 text-white border-white/30" : "glass border-white/20 text-white hover:bg-white/10"}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Chat
              </Button>
              <Button
                onClick={() => setViewMode("edit")}
                variant={viewMode === "edit" ? "default" : "outline"}
                size="sm"
                className={viewMode === "edit" ? "glass bg-white/20 text-white border-white/30" : "glass border-white/20 text-white hover:bg-white/10"}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          )}
          
          {!selectedNote && (
            <Button
              onClick={() => setViewMode("edit")}
              className="glass bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Note
            </Button>
          )}
        </div>
      </div>

      {/* Main Content - Chat or Edit View */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === "chat" ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" 
                      ? "bg-gradient-to-r from-green-500 to-blue-500" 
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}>
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <Card className={`glass-card border-white/20 ${
                    message.type === "user" 
                      ? "bg-blue-500/20 border-blue-500/30" 
                      : "bg-white/5"
                  }`}>
                    <div className="p-3">
                      <p className="text-white text-sm leading-relaxed">{message.content}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <Card className="glass-card border-white/20 bg-white/5">
                    <div className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span className="text-gray-400 text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="glass-card border-white/20">
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                      className="glass-input text-white placeholder:text-gray-400"
                      placeholder="Enter note title"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Content</label>
                    <Textarea
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                      className="glass-input text-white placeholder:text-gray-400 min-h-[300px]"
                      placeholder="Write your thoughts here..."
                    />
                  </div>
                  
                  {selectedNote && (
                    <div className="glass p-4 rounded-lg">
                      <p className="text-white text-sm font-medium mb-2">Current AI Summary:</p>
                      <p className="text-gray-300 text-sm">{selectedNote.summary || "No summary available"}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={selectedNote ? handleUpdateNote : handleCreateNote}
                      disabled={isLoading || !noteForm.title.trim() || !noteForm.content.trim()}
                      className="glass bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : selectedNote ? "Update Note" : "Create Note"}
                    </Button>
                    
                    <Button
                      onClick={() => setViewMode("chat")}
                      variant="outline"
                      className="glass border-white/20 text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Input Area - Only show in chat mode */}
      {viewMode === "chat" && (
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your notes or create new ones..."
                className="glass-input text-white placeholder:text-gray-400 pr-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 glass bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
          <p className="text-gray-500 text-xs mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  )
}
