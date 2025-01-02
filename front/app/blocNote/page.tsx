'use client'
import Home from '@/components/Home'
import { useEffect, useState, useRef } from 'react'
import { Content } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NoteEditor from './noteEditor'

interface Note {
  id: number
  title: string
  content: Content
}

const NotePad = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      const savedNotes = localStorage.getItem('notes')
      console.log('savedNotes', savedNotes)
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      }
      isMounted.current = true
    }
  }, [])

  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem('notes', JSON.stringify(notes))
    }
  }, [notes])

  const handleSave = (content: Content) => {
    if (selectedNoteId !== null) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === selectedNoteId ? { ...note, content } : note,
        ),
      )
      alert('La note a été sauvegardée')
    }
  }

  const handleClear = () => {
    if (selectedNoteId !== null) {
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== selectedNoteId),
      )
      setSelectedNoteId(null)
      alert('La note a été effacée de la sauvegarde')
    }
  }

  const handleAddNote = () => {
    if (newNoteTitle.trim() !== '') {
      const newNote: Note = {
        id: Date.now(),
        title: newNoteTitle,
        content: '',
      }
      setNotes((prevNotes) => [...prevNotes, newNote])
      setNewNoteTitle('')
      setIsAddingNote(false)
      setSelectedNoteId(newNote.id)
    }
  }

  const handleSelectNote = (id: number) => {
    setSelectedNoteId(id)
  }

  const handleTitleChange = (title: string) => {
    if (selectedNoteId !== null) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === selectedNoteId ? { ...note, title } : note,
        ),
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddNote()
    }
  }

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  return (
    <Home>
      <div className='flex'>
        <div className='w-1/4 p-4 border-r'>
          <h2 className='text-lg font-bold'>Notes</h2>
          <ul>
            {notes.map((note) => (
              <li
                key={note.id}
                className={`cursor-pointer p-2 ${
                  note.id === selectedNoteId ? 'bg-gray-200' : ''
                }`}
                onClick={() => handleSelectNote(note.id)}
              >
                {note.title}
              </li>
            ))}
            <li
              className='cursor-pointer p-2 text-blue-500'
              onClick={() => setIsAddingNote(true)}
            >
              + Nouvelle note
            </li>
            {isAddingNote && (
              <li className='p-2'>
                <Input
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  onKeyUp={handleKeyPress}
                  placeholder='Titre de la nouvelle note'
                  className='text-black border-secondary_blue placeholder-gray-400 focus:border-secondary_blue mb-2'
                  autoFocus
                />
              </li>
            )}
          </ul>
        </div>
        <div className='w-3/4 p-4'>
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onSave={handleSave}
              onClear={handleClear}
              onTitleChange={handleTitleChange}
            />
          ) : (
            <p>Sélectionnez une note pour commencer à écrire</p>
          )}
        </div>
      </div>
    </Home>
  )
}

export default NotePad
