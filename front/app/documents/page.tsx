'use client'
import React, { useEffect, useState } from 'react'
import BaseForm from '@/components/BaseForm'
import Home from '@/components/Home'
import {
  downloadDocument,
  postRequest,
  postRequestDropDocument,
} from '@/api/api'

interface FormData {
  documentType: string
  document: File | null
  documentName: string
}

interface SelectField {
  type: 'select'
  label: string
  name: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

interface UserDocument {
  id_document: number
  name: string
  type: string
  document_path: string
  uploaded_at: string
}

type Field = SelectField

function Documents() {
  const [formData, setFormData] = useState<FormData>({
    documentType: '',
    document: null,
    documentName: '',
  })

  const [documents] = useState([
    { value: 'doc_0', label: '' },
    { value: 'doc_1', label: 'Fiche de synthese S5' },
    { value: 'doc_2', label: 'Fiche de synthese S6' },
    { value: 'doc_3', label: 'Fiche de synthese S7' },
    { value: 'doc_4', label: 'Fiche de synthese S8' },
    { value: 'doc_5', label: 'Fiche de synthese S9' },
    { value: 'doc_6', label: 'Fiche de synthese S10' },
    { value: 'doc_7', label: 'Rapport de conduite de projet S6' },
    { value: 'doc_8', label: 'Rapport de conduite de projet S7' },
    { value: 'doc_9', label: 'Rapport avant PING' },
    { value: 'doc_10', label: 'Rapport avancement PING' },
    { value: 'doc_11', label: 'Rapport final PING' },
  ])

  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([])

  useEffect(() => {
    fetchUserDocuments()
  }, [])

  const fetchUserDocuments = async () => {
    try {
      const response = await postRequest('document/getUserDocuments')
      setUserDocuments(response.documents)
    } catch (error) {
      console.error('Error fetching user documents:', error)
    }
  }

  const handleDocumentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      documentName: e.target.value,
    })
  }

  const handleDownload = async (documentPath: string) => {
    try {
      await downloadDocument('document/download', {
        data: { path: documentPath },
      })
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('Erreur lors du téléchargement du document')
    }
  }

  const cleanDocumentName = (name: string) => {
    // Si Charach Spécial => envoie BDD Faill
    const withoutAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return withoutAccents.replace(/[^a-zA-Z0-9]/g, '_')
  }

  const handleDocumentTypeChange = (value: string) => {
    setFormData({
      ...formData,
      documentType: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const document = e.target.files ? e.target.files[0] : null
    setFormData({
      ...formData,
      document,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.documentType || formData.documentType === 'doc_0') {
      alert('Veuillez sélectionner un type de document valide.')
      return
    }

    if (!formData.document) {
      alert('Veuillez sélectionner un fichier à télécharger.')
      return
    }

    if (!formData.documentName.trim()) {
      alert('Veuillez entrer un nom pour le document.')
      return
    }

    const formDataToSend = new FormData()

    const selectedDocument = documents.find(
      (doc) => doc.value === formData.documentType,
    )
    const documentName = selectedDocument
      ? cleanDocumentName(selectedDocument.label)
      : ''

    const jsonData = JSON.stringify({
      documentName: formData.documentName,
      documentType: formData.documentType,
    })

    formDataToSend.append('data', jsonData)
    formDataToSend.append('document', formData.document)

    const url = 'document/dropDocument'
    try {
      const response = await postRequestDropDocument(url, formDataToSend)
      console.log('Success:', response)
      alert('Document ajouté avec succès')
      setFormData({
        documentType: '',
        document: null,
        documentName: '',
      })
      await fetchUserDocuments()
    } catch (error) {
      console.error('Error:', error)
      alert("Erreur lors de l'ajout du document")
    }
  }

  const handleDelete = async (documentId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await postRequest(
          'document/deleteDocument',
          JSON.stringify({ data: { id: documentId } }),
        )
        alert('Document supprimé avec succès')
        await fetchUserDocuments()
      } catch (error) {
        console.error('Error deleting document:', error)
        alert('Erreur lors de la suppression du document')
      }
    }
  }
  const fields: Field[] = [
    {
      type: 'select',
      label: 'Type de document :',
      name: 'documentType',
      value: formData.documentType,
      options: documents,
      onChange: handleDocumentTypeChange,
    },
  ]

  const fieldsOrder = ['documentType']

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
            htmlFor='documentName'
            className='block text-sm font-medium text-gray-700'
          >
            Nom du document
          </label>
          <input
            type='text'
            id='documentName'
            name='documentName'
            value={formData.documentName}
            onChange={handleDocumentNameChange}
            required
            className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='document'
            className='block text-sm font-medium text-gray-700'
          >
            Charger un fichier
          </label>
          <input
            type='file'
            id='document'
            name='document'
            accept='.pdf,.docx,.xlsx,.xls,.odt,.txt'
            onChange={handleFileChange}
            className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
      </BaseForm>
      <div className='mt-8'>
        <h2 className='text-2xl font-bold mb-4'>Vos documents</h2>
        {userDocuments.length > 0 ? (
          <ul className='space-y-2'>
            {userDocuments.map((doc) => (
              <li
                key={doc.id_document}
                className='flex justify-between items-center bg-white p-4 rounded shadow'
              >
                <span>{doc.name}</span>
                <span className='ml-2 text-sm text-gray-500'>({doc.type})</span>
                <div>
                  <button
                    onClick={() => handleDownload(doc.document_path)}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2'
                  >
                    Télécharger
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id_document)}
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Vous n&apos;avez pas encore de documents.</p>
        )}
      </div>
    </Home>
  )
}

export default Documents
