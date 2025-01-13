'use client'
import React, { useEffect, useState, useCallback } from 'react'
import BaseForm from '@/components/BaseForm'
import Home from '@/components/Home'
import { useDropzone } from 'react-dropzone'
import {
  downloadDocument,
  postRequest,
  postRequestDropDocument,
  fetchDocumentBlob,
} from '@/api/api'
import ProgressPopup from '@/components/ProgressPopup'
import DocumentViewerDialog from '@/components/DocumentViewerDialog'

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

function Evaluations() {
  const [formData, setFormData] = useState<FormData>({
    documentType: '',
    document: null,
    documentName: '',
  })

  const [documents] = useState([
    { value: 'Grille evaluation', label: 'Grille evaluation' },
  ])

  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupStatus, setPopupStatus] = useState<'creating' | 'success' | 'error'>('creating')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [progressMessage, setProgressMessage] = useState<string>('')
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState('')
  const [currentDocumentName, setCurrentDocumentName] = useState('')

  useEffect(() => {
    fetchUserDocuments()
  }, [])

  const fetchUserDocuments = async () => {
    try {
      const response = await postRequest('document/getUserDocuments')
      const filteredDocuments = response.documents.filter((doc: UserDocument) => doc.type === 'Grille evaluation')
      setUserDocuments(filteredDocuments)
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFormData({
      ...formData,
      document: acceptedFiles[0],
    })
  }, [formData])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.oasis.opendocument.text': ['.odt'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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
      documentType: 'Grille evaluation',
    })

    formDataToSend.append('data', jsonData)
    formDataToSend.append('document', formData.document)

    const url = 'document/dropDocument'
    try {
      setIsPopupOpen(true)
      setProgressMessage('Téléchargement en cours...')
      setPopupStatus('creating')
      const response = await postRequestDropDocument(url, formDataToSend)
      console.log('Success:', response)
      setProgressMessage('Document ajouté avec succès')
      setPopupStatus('success')
      setFormData({
        documentType: '',
        document: null,
        documentName: '',
      })
      await fetchUserDocuments()
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage("Erreur lors de l'ajout du document")
      setPopupStatus('error')
    } finally {
      setTimeout(() => {
        setIsPopupOpen(false)
      }, 2000)
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

  const handleView = async (documentPath: string, documentName: string) => {
    console.log('Viewing document:', documentPath)
    try {
      const blobUrl = await fetchDocumentBlob('document/download', {
        data: { path: documentPath },
      })
      console.log('Document URL:', blobUrl)
      setCurrentDocumentUrl(blobUrl)
      setCurrentDocumentName(documentName)
      setIsViewerOpen(true)
    } catch (error) {
      console.error('Error fetching document:', error)
      alert('Erreur lors de la récupération du document')
    }
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
    const withoutAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return withoutAccents.replace(/[^a-zA-Z0-9]/g, '_')
  }

  const fields: Field[] = [
    {
      type: 'select',
      label: 'Type de document :',
      name: 'documentType',
      value: formData.documentType,
      options: documents,
      onChange: (value: string) => setFormData({ ...formData, documentType: value }),
    },
  ]

  const isPdf = (filePath: string) => {
    return filePath.toLowerCase().endsWith('.pdf')
  }

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
        <div
          {...getRootProps()}
          className='border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer focus:outline-none mb-2'
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className='text-center text-gray-500'>Déposez le fichier ici...</p>
          ) : (
            <p className='text-center text-gray-500'>
              Faites glisser et déposez un fichier ici, ou cliquez pour sélectionner un fichier
            </p>
          )}
          {formData.document && (
            <div className='mt-2 text-center text-gray-700'>
              <p>Fichier sélectionné : {formData.document.name}</p>
            </div>
          )}
        </div>
      </BaseForm>
      <div className='mt-8'>
        <h2 className='text-2xl font-bold mb-4'>Vos documents</h2>
        {userDocuments.length > 0 ? (
          <>
            <div className='grid grid-cols-3 gap-4 mb-2 font-bold'>
              <span className='col-span-1'>Nom</span>
              <span className='col-span-1'>Type</span>
              <span className='col-span-1 text-right pr-28'>Actions</span>
            </div>
            <ul className='space-y-2'>
              {userDocuments.map((doc) => (
                <li
                  key={doc.id_document}
                  className='grid grid-cols-3 gap-4 items-center bg-white p-4 rounded shadow'
                >
                  <span>{doc.name}</span>
                  <span className='ml-2 text-sm text-gray-500'>{doc.type}</span>
                  <div className='col-span-1 text-right'>
                    {isPdf(doc.document_path) && (
                      <button
                        onClick={() => handleView(doc.document_path, doc.name)}
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2'
                      >
                        Visualiser
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(doc.document_path, doc.name)}
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
          </>
        ) : (
          <p>Vous n&apos;avez pas encore de documents.</p>
        )}
      </div>
      <ProgressPopup
        isOpen={isPopupOpen}
        status={popupStatus}
        creatingMessage={progressMessage}
        successMessage='Document ajouté avec succès !'
        errorMessage={errorMessage}
        onClose={() => setIsPopupOpen(false)}
      />
      <DocumentViewerDialog
        open={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        documentUrl={currentDocumentUrl}
        documentName={currentDocumentName}
      />
    </Home>
  )
}

export default Evaluations