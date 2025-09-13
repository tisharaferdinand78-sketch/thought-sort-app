"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Plus, Bot, User, Sparkles, Edit3, MessageSquare, Save, X, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  noteId?: string
  canAddToNote?: boolean
}

interface ChatInterfaceProps {
  onNewNote: () => void
  selectedNote: Note | null
  selectedChat: Chat | null
  onNoteUpdate: (note: Note) => void
  onNoteSelect: (note: Note | null) => void
  onChatSelect: (chat: Chat | null) => void
  onChatUpdate: (chat: Chat) => void
}

interface Note {
  id: string
  title: string
  content: string
  summary: string | null
  createdAt: string
  updatedAt: string
}

interface Chat {
  id: string
  title: string
  noteId?: string
  createdAt: string
  updatedAt: string
  messages: Message[]
  note?: {
    id: string
    title: string
  }
}

interface Message {
  id: string
  content: string
  role: string
  createdAt: string
}

export function ChatInterface({ onNewNote, selectedNote, selectedChat, onNoteUpdate, onNoteSelect, onChatSelect, onChatUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Welcome to Thought Sort! 🚀 I'm your AI assistant here to help you organize your thoughts. You can:\n\n• Type your wild thoughts and press Enter to create notes\n• Ask me questions about note-taking and organization\n• Select a note to chat about it specifically\n• Use keywords like 'create note' to make new notes\n\nWhat would you like to explore today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"chat" | "edit">("chat")
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteForm, setNoteForm] = useState({ title: "", content: "" })
  const [isExpanded, setIsExpanded] = useState(false)
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

  useEffect(() => {
    if (selectedChat) {
      // Load messages from the selected chat
      const chatMessages = selectedChat.messages.map(msg => ({
        id: msg.id,
        type: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        noteId: selectedChat.noteId,
        canAddToNote: msg.role === "assistant" && selectedChat.noteId
      }))
      setMessages(chatMessages)
    } else {
      // Reset to welcome message when no chat is selected
      setMessages([{
        id: "1",
        type: "assistant",
        content: "Welcome to Thought Sort! 🚀 I'm your AI assistant here to help you organize your thoughts. You can:\n\n• Type your wild thoughts and press Enter to create notes\n• Ask me questions about note-taking and organization\n• Select a note to chat about it specifically\n• Use keywords like 'create note' to make new notes\n\nWhat would you like to explore today?",
        timestamp: new Date()
      }])
    }
  }, [selectedChat])

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
          timestamp: new Date(),
          canAddToNote: false
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

  const handleRegenerateSummary = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (!selectedNote) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/notes/${selectedNote.id}/summary`, {
        method: "POST",
      })

      if (response.ok) {
        const updatedNote = await response.json()
        onNoteUpdate(updatedNote)
        setEditingNote(updatedNote)
        toast.success("Summary regenerated successfully!")
      } else {
        toast.error("Failed to regenerate summary")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddResponseToNote = async (responseContent: string) => {
    if (!selectedNote) return

    setIsLoading(true)
    try {
      const updatedContent = `${selectedNote.content}\n\n--- AI Response ---\n${responseContent}`
      
      const response = await fetch(`/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedNote.title,
          content: updatedContent,
          regenerateSummary: true
        }),
      })

      if (response.ok) {
        const updatedNote = await response.json()
        onNoteUpdate(updatedNote)
        toast.success("AI response added to note!")
        
        // Update the note form if we're in edit mode
        if (editingNote && editingNote.id === selectedNote.id) {
          setNoteForm({
            title: updatedNote.title,
            content: updatedNote.content
          })
        }
      } else {
        toast.error("Failed to add response to note")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNoteFromInput = async (content: string) => {
    if (!content.trim() || isLoading) return

    setIsLoading(true)
    try {
      // Create a note with the input content
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""), // Auto-generate title from content
          content: content.trim()
        }),
      })

      if (response.ok) {
        const newNote = await response.json()
        onNoteUpdate(newNote)
        toast.success("Note created successfully!")
        
        // Add a message about the new note
        const noteMessage: Message = {
          id: Date.now().toString(),
          type: "assistant",
          content: `Great! I've created a new note "${newNote.title}" with an AI-generated summary. You can continue typing to create more notes or select this note to chat about it.`,
          timestamp: new Date(),
          canAddToNote: false
        }
        setMessages(prev => [...prev, noteMessage])
      } else {
        const errorData = await response.json()
        console.error("Failed to create note:", errorData)
        toast.error(`Failed to create note: ${errorData.error || "Unknown error"}`)
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
    const currentInput = inputValue.trim()
    setInputValue("")
    setIsExpanded(false)
    setIsLoading(true)

    try {
      // Create a new chat if none is selected
      let currentChatId = selectedChat?.id
      if (!currentChatId) {
        const chatResponse = await fetch("/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: currentInput.slice(0, 50) + (currentInput.length > 50 ? "..." : ""),
            noteId: selectedNote?.id || null
          }),
        })
        
        if (chatResponse.ok) {
          const newChat = await chatResponse.json()
          currentChatId = newChat.id
          onChatSelect(newChat)
        }
      }

      if (selectedNote) {
        // Chat about the selected note using AI
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: currentInput,
            noteId: selectedNote.id,
            noteContent: selectedNote.content,
            noteTitle: selectedNote.title,
            chatId: currentChatId
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: data.response,
            timestamp: new Date(),
            canAddToNote: true
          }
          setMessages(prev => [...prev, assistantMessage])
          
          // Update the chat with new messages
          if (currentChatId) {
            const updatedChat = await fetch(`/api/chats/${currentChatId}`)
            if (updatedChat.ok) {
              const chatData = await updatedChat.json()
              onChatUpdate(chatData)
            }
          }
        } else {
          const errorData = await response.json()
          if (response.status === 401) {
            throw new Error("Please log in to use the chat feature")
          }
          throw new Error(errorData.error || "Failed to get AI response")
        }
      } else {
        // General chat or auto-create note from input
        if (currentInput.toLowerCase().includes('create') || currentInput.toLowerCase().includes('note')) {
          // Auto-create note from input
          await handleCreateNoteFromInput(currentInput)
        } else {
          // General chat
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: currentInput,
              chatId: currentChatId
            }),
          })

          if (response.ok) {
            const data = await response.json()
            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: data.response,
              timestamp: new Date(),
              canAddToNote: false
            }
            setMessages(prev => [...prev, assistantMessage])
            
            // Update the chat with new messages
            if (currentChatId) {
              const updatedChat = await fetch(`/api/chats/${currentChatId}`)
              if (updatedChat.ok) {
                const chatData = await updatedChat.json()
                onChatUpdate(chatData)
              }
            }
          } else {
            const errorData = await response.json()
            if (response.status === 401) {
              throw new Error("Please log in to use the chat feature")
            }
            throw new Error(errorData.error || "Failed to get AI response")
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to process your message"
      toast.error(errorMessage)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    // Auto-expand when typing
    if (e.target.value.length > 0 && !isExpanded) {
      setIsExpanded(true)
    }
  }

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setIsExpanded(true)
    }
  }

  const handleInputBlur = () => {
    if (!inputValue.trim()) {
      setIsExpanded(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Simplified Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">
              {selectedChat ? selectedChat.title : selectedNote ? `Working with: ${selectedNote.title}` : "Thought Sort"}
            </h2>
            <p className="text-gray-400 text-sm">
              {selectedChat ? `Chat conversation${selectedChat.note ? ` about ${selectedChat.note.title}` : ''}` : 
               selectedNote ? "Chat about this note or edit it" : "Type your thoughts and press Enter to create notes"}
            </p>
          </div>
        </div>
        
        {selectedNote && (
          <div className="flex gap-3">
            <Button
              onClick={() => setViewMode("chat")}
              variant={viewMode === "chat" ? "default" : "outline"}
              size="default"
              className={viewMode === "chat" ? "glass bg-white/20 text-white border-white/30 px-6" : "glass border-white/20 text-white hover:bg-white/10 px-6"}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button
              onClick={() => setViewMode("edit")}
              variant={viewMode === "edit" ? "default" : "outline"}
              size="default"
              className={viewMode === "edit" ? "glass bg-white/20 text-white border-white/30 px-6" : "glass border-white/20 text-white hover:bg-white/10 px-6"}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => {
                onNoteSelect(null)
                onChatSelect(null)
                setViewMode("chat")
                setMessages([{
                  id: "1",
                  type: "assistant",
                  content: "Welcome to Thought Sort! 🚀 I'm your AI assistant here to help you organize your thoughts. You can:\n\n• Type your wild thoughts and press Enter to create notes\n• Ask me questions about note-taking and organization\n• Select a note to chat about it specifically\n• Use keywords like 'create note' to make new notes\n\nWhat would you like to explore today?",
                  timestamp: new Date()
                }])
              }}
              variant="outline"
              size="default"
              className="glass border-white/20 text-white hover:bg-white/10 px-6"
            >
              <X className="w-4 h-4 mr-2" />
              {selectedNote ? "Close" : "New Chat"}
            </Button>
          </div>
        )}
      </div>

      {/* Main Content - Chat or Edit View */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === "chat" ? (
          <div className="space-y-4">
            {/* Chat Messages */}
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
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-gray-400 text-xs">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {message.type === "assistant" && message.canAddToNote && selectedNote && (
                          <Button
                            onClick={() => handleAddResponseToNote(message.content)}
                            size="sm"
                            className="glass bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs px-2 py-1"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add to Note
                          </Button>
                        )}
                      </div>
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
                        <span className="text-gray-400 text-sm">Creating note...</span>
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
                <div className="space-y-6">
                  {/* Note Info Header */}
                  {selectedNote && (
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-white text-2xl font-semibold mb-2">Editing: {selectedNote.title}</h2>
                      <p className="text-gray-400 text-sm">
                        Created: {new Date(selectedNote.createdAt).toLocaleDateString()} • 
                        Updated: {new Date(selectedNote.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  {/* Edit Form */}
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
                        className="glass-input text-white placeholder:text-gray-400 min-h-[400px]"
                        placeholder="Write your thoughts here..."
                      />
                    </div>
                  </div>
                  
                  {/* Current Summary Display */}
                  {selectedNote && selectedNote.summary && (
                    <div className="glass p-4 rounded-lg bg-blue-500/10 border-blue-500/20">
                      <p className="text-white text-sm font-medium mb-2">Current AI Summary:</p>
                      <p className="text-gray-300 text-sm">{selectedNote.summary}</p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={selectedNote ? handleUpdateNote : handleCreateNote}
                      disabled={isLoading || !noteForm.title.trim() || !noteForm.content.trim()}
                      className="glass bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : selectedNote ? "Update Note" : "Create Note"}
                    </Button>
                    
                    {selectedNote && (
                      <Button
                        onClick={(e) => handleRegenerateSummary(e)}
                        disabled={isLoading}
                        variant="outline"
                        className="glass border-white/20 text-white hover:bg-white/10"
                        type="button"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate Summary
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => setViewMode("chat")}
                      variant="outline"
                      className="glass border-white/20 text-white hover:bg-white/10"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Back to Chat
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Centered Input Area - Only show in chat mode */}
      {viewMode === "chat" && (
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative">
              <div className={`relative transition-all duration-300 ${
                isExpanded ? 'mb-4' : ''
              }`}>
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedNote ? `Ask me about "${selectedNote.title}" or type new thoughts...` : "Type your wild thoughts here... Press Enter to organize the magic"}
                  className={`glass-input text-white placeholder:text-gray-400 pr-12 transition-all duration-300 ${
                    isExpanded ? 'h-20 text-base' : 'h-12 text-sm'
                  }`}
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
            <p className="text-gray-500 text-xs text-center mt-2">
              {isExpanded ? "Press Enter to create note" : "Start typing to expand"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
