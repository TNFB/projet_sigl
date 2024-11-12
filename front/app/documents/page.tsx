'use client'
import React, { useState } from 'react'
import Home from '@/components/Home'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Documents() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleTypeChange = (value: string) => {
    setDocumentType(value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Logic to handle file upload and form submission
    console.log('File:', selectedFile)
    console.log('Document Type:', documentType)
  }

  return (
    <Home>
      <div className="p-4 border-2 w-fit" >
        <h2 className="text-xl font-bold mb-4">Déposer un document</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label className="block text-sm font-medium text-gray-700">
                Choisir un fichier
              </Label>
              <Input
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-56 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <Label className="block text-sm font-medium text-gray-700">
                Type de document
              </Label>
              <Select onValueChange={handleTypeChange}>
                <SelectTrigger className="mt-1 block w-24 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="s5">Fiche de synthèse S5</SelectItem>
                  <SelectItem value="s6">Fiche de synthèse S6</SelectItem>
                  <SelectItem value="s7">Fiche de synthèse S7</SelectItem>
                  <SelectItem value="s8">Fiche de synthèse S8</SelectItem>
                  <SelectItem value="s9">Fiche de synthèse S9</SelectItem>
                  <SelectItem value="s10">Fiche de synthèse S10</SelectItem>
                  <SelectItem value="RCS6">Rapport de conduite de projet S6</SelectItem>
                  <SelectItem value="RCS7">Rapport de conduite de projet S7</SelectItem>
                  <SelectItem value="RAP8">Rapport avant PING</SelectItem>
                  <SelectItem value="RAP9">Rapport avancement PING</SelectItem>
                  <SelectItem value="RFP10">Rapport final PING</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Envoyer
            </Button>
          </div>
        </form>
      </div>
    </Home>
  );
}