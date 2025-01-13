'use client'
import Home from '@/components/Home'
import { useEffect, useState, useRef } from 'react'
import { Content } from '@tiptap/react'
import { Input } from '@/components/ui/input'
import NoteEditor from './noteEditor'
import { postRequest } from '@/api/api'

interface Note {
  id_monthly_note: number
  title: string
  content: Content
}

const NotePad = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [save, setSave] = useState(true)

  useEffect(() => {
      postRequest('monthlyNotes/getAllNotes').then((response) => {
        setNotes(response.notes)
      })
  }, [])

  const handleSave = async (title: string, content: Content) => {
    if (save) {
      const updatedNotes = notes.map((note) =>
        note.id_monthly_note === selectedNoteId
          ? { ...note, content, title }
          : note,
      )
      setNotes(updatedNotes)
      await postRequest(
        'monthlyNotes/updateNote',
        JSON.stringify({
          data: {
            id_monthly_note: selectedNoteId,
            content,
            title,
          },
        }),
      )
      alert('La note a été sauvegardée')
    } else {
      const response = await postRequest(
        'monthlyNotes/createNote',
        JSON.stringify({
          data: { id_monthly_note: selectedNoteId, title: title, content },
        }),
      )
      setNotes((prevNotes) => [
        ...prevNotes.filter((note) => note.id_monthly_note !== selectedNoteId),
        response.note,
      ])
      setSave(true)
      alert('La nouvelle note a été créée')
    }
  }

  const handleClear = async () => {
    if (selectedNoteId !== null) {
      // Supprimer la note de la base de données
      const response = await postRequest(
        'monthlyNotes/deleteNote',
        JSON.stringify({
          data: { id_monthly_note: selectedNoteId },
        }),
      )
  
      // Supprimer la note de l'état local
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id_monthly_note !== selectedNoteId),
      )
      setSelectedNoteId(null)
      alert('La note a été effacée de la sauvegarde et de la base de données')
    }
  }

  const handleAddNote = () => {
    if (newNoteTitle.trim() !== '') {
      const newNote: Note = {
        id_monthly_note: Date.now(),
        title: newNoteTitle,
        content: '',
      }
      setNotes((prevNotes) => [...prevNotes, newNote])
      setSave(false)
      setNewNoteTitle('')
      setIsAddingNote(false)
      setSelectedNoteId(newNote.id_monthly_note)
    }
  }

  const handleSelectNote = (id: number) => {
    setSelectedNoteId(id)
  }

  const handleTitleChange = (title: string) => {
    if (selectedNoteId !== null) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id_monthly_note === selectedNoteId ? { ...note, title } : note,
        ),
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddNote()
    }
  }

  const selectedNote = notes.find((note) => note.id_monthly_note === selectedNoteId)

  return (
    <Home>
      <div className='flex'>
        <div className='w-1/4 p-4 border-r'>
          <h2 className='text-lg font-bold'>Notes</h2>
          <ul>
            {notes.map((note) => (
              <li
                key={note.id_monthly_note}
                className={`cursor-pointer p-2 ${
                  note.id_monthly_note === selectedNoteId ? 'bg-gray-200' : ''
                }`}
                onClick={() => handleSelectNote(note.id_monthly_note)}
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
                  className='text-black rounded-none border-gray-300 placeholder-gray-400 focus:border-secondary_blue mb-2'
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
