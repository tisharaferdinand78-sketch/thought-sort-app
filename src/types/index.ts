export interface Note {
  id: string
  title: string
  content: string
  summary: string | null
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  content: string
  role: string
  createdAt: string
}

export interface Chat {
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
