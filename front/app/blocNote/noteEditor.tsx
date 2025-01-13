'use client'
import { useEffect, useState } from 'react'
import { Content } from '@tiptap/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MinimalTiptapEditor } from '@/components/minimal-tiptap'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
interface Note {
  id_monthly_note: number
  title: string
  content: Content
}

interface NoteEditorProps {
  note: Note
  onSave: (title: string, content: Content) => void
  onClear: () => void
  onTitleChange: (title: string) => void
}

const NoteEditor = ({
  note,
  onSave,
  onClear,
  onTitleChange,
}: NoteEditorProps) => {
  const [value, setValue] = useState<Content>(note.content)
  const [title, setTitle] = useState(note.title)

  useEffect(() => {
    setValue(note.content)
    setTitle(note.title)
  }, [note])

  const handleSave = () => {
    onSave(title, value)
  }

  const handleClear = () => {
    setValue('')
    onClear()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    onTitleChange(e.target.value)
  }

  return (
    <div>
      <Input
        value={title}
        onChange={handleTitleChange}
        placeholder='Titre de la note'
        className='text-black border-gray-300 placeholder-gray-400 focus:border-secondary_blue mb-2 rounded-none'
      />
      <TooltipProvider>
        <MinimalTiptapEditor
          key={note.id_monthly_note}
          value={value}
          onChange={setValue}
          className='w-full'
          editorContentClassName='p-5'
          output='html'
          placeholder='Entrez votre note ici...'
          immediatelyRender={false}
        />
        <div className='mt-4 flex space-x-2'>
          <Button onClick={handleSave}>Sauvegarder</Button>
          <Button onClick={handleClear}>Effacer</Button>
        </div>
      </TooltipProvider>
    </div>
  )
}

export default NoteEditor
