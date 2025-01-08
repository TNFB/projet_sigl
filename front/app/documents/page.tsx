'use client'
import React, { useState } from 'react'
import BaseForm from '@/components/BaseForm'
import Home from '@/components/Home'
import { postRequestDropDocument } from '@/api/api'

interface FormData {
  document: string
  file: File | null
}

interface SelectField {
  type: 'select'
  label: string
  name: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

type Field = SelectField

function Documents() {
  const [formData, setFormData] = useState<FormData>({
    document: '',
    file: null,
  })

  const handleDocumentChange = (value: string) => {
    setFormData({
      ...formData,
      document: value,
    })
  }

  /*const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({
      ...formData,
      file,
    });
  };*/

  const [documents] = useState([
    { value: 'doc_1', label: 'Fiche de synthèse S5' },
    { value: 'doc_2', label: 'Fiche de synthèse S6' },
    { value: 'doc_3', label: 'Fiche de synthèse S7' },
    { value: 'doc_4', label: 'Fiche de synthèse S8' },
    { value: 'doc_5', label: 'Fiche de synthèse S9' },
    { value: 'doc_6', label: 'Fiche de synthèse S10' },
    { value: 'doc_7', label: 'Rapport de conduite de projet S6' },
    { value: 'doc_8', label: 'Rapport de conduite de projet S7' },
    { value: 'doc_9', label: 'Rapport avant PING' },
    { value: 'doc_10', label: 'Rapport avancement PING' },
    { value: 'doc_11', label: 'Rapport final PING' },
  ])

  const [file, setFile] = useState<File | null>(null)
  const [documentName, setDocumentName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      console.error('No file selected')
      setError('Veuillez sélectionner un fichier à télécharger.')
      return
    }

    setError(null)

    // Construire un FormData avec le fichier et les métadonnées
    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', email)
    formData.append('documentName', documentName)

    try {
      const response = await postRequestDropDocument(
        'document/dropDocument',
        formData,
      )
      console.log('Document uploaded successfully:', response)
    } catch (error) {
      console.error('Error uploading document:', error)
    }
  }

  const fields: Field[] = [
    {
      type: 'select',
      label: 'type document :',
      name: 'document',
      value: formData.document,
      options: documents,
      onChange: handleDocumentChange,
    },
  ]

  const fieldsOrder = ['document']

  return (
    <Home>
      <BaseForm
        title="Ajout d'un document"
        submitLabel='Ajouter'
        onSubmit={handleSubmit}
        fields={fields}
        fieldsOrder={fieldsOrder}
        className='h-fit w-fit'
      >
        <div className='mb-4'>
          <label
            htmlFor='file'
            className='block text-sm font-medium text-gray-700'
          >
            Charger un fichier
            {error && <p className='text-red-500 text-sm'>{error}</p>}
          </label>
          <input
            type='file'
            id='file'
            name='file'
            accept='.pdf,.docx,.xlsx,.xls,.odt,.txt' // Extensions autorisées
            onChange={(e) => {
              const selectedFile = e.target.files?.[0]
              if (selectedFile) {
                setFile(selectedFile)
              }
            }}
            className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='documentName'
            className='block text-sm font-medium text-gray-700'
          >
            Nom du document
          </label>
          <input
            type='text'
            id='documentName'
            name='documentName'
            onChange={(e) => setDocumentName(e.target.value)}
            className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            onChange={(e) => setEmail(e.target.value)}
            className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
      </BaseForm>
    </Home>
  )
}

export default Documents
