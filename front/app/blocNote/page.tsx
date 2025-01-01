'use client'
import Home from '@/components/Home'
import { useEffect, useState } from 'react'
import { Content } from '@tiptap/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MinimalTiptapEditor } from '@/components/minimal-tiptap'
import { Button } from '@/components/ui/button'

const NotePad = () => {
  const [value, setValue] = useState<Content>('')

  useEffect(() => {
    const savedValue = localStorage.getItem('notePadValue')
    console.log('savedValue', savedValue)
    if (savedValue) {
      setValue(JSON.parse(savedValue))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('notePadValue', JSON.stringify(value))
    alert('La note à été sauvegardé')
  }

  const handleClear = () => {
    localStorage.removeItem('notePadValue')
    alert('La note à été effacé de la sauvegarde')
  }

  return (
    <Home>
      <TooltipProvider>
        <MinimalTiptapEditor
          value={value}
          onChange={setValue}
          className="w-full"
          editorContentClassName="p-5"
          output="html"
          placeholder="Type your description here..."
        />
        <div className="mt-4 flex space-x-2">
          <Button onClick={handleSave}>Sauvegarder</Button>
          <Button onClick={handleClear}>Effacer la sauvegarde</Button>
        </div>
      </TooltipProvider>
    </Home>
  )
}

export default NotePad
