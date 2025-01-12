import React, { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import { postRequestImportUser } from '@/api/api'
import ProgressPopup from '@/components/ProgressPopup'

const FileUploadDialog = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupStatus, setPopupStatus] = useState<
    'creating' | 'success' | 'error'
  >('creating')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [progressMessage, setProgressMessage] = useState<string>('')

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.xlsx, .xls',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsPopupOpen(true)
    setProgressMessage('Importation en cours...')
    setPopupStatus('creating')
    console.log('file', file)
    const formData = new FormData()
    formData.append('file', file)
    try {
      await postRequestImportUser('document/importUsers', formData)
      setProgressMessage('Fichier importé avec succès')
      setPopupStatus('success')
      setTimeout(() => {
        setFile(null)
        setIsPopupOpen(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de l'importation du fichier:", error)
      setErrorMessage("Erreur lors de l'importation du fichier")
      setPopupStatus('error')
      setTimeout(() => {
        setIsPopupOpen(false)
      }, 2000)
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Déposer le fichier Excel :</DialogTitle>
            <DialogDescription>
              Fichier de création des utilisateurs d&apos;une promotion
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div
              {...getRootProps()}
              className='border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer focus:outline-none'
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className='text-center text-gray-500'>
                  Déposez le fichier ici...
                </p>
              ) : (
                <p className='text-center text-gray-500'>
                  Faites glisser et déposez un fichier ici, ou cliquez pour
                  sélectionner un fichier
                </p>
              )}
            </div>
            {file && (
              <div className='mt-2 text-center text-gray-700'>
                <p>Fichier sélectionné : {file.name}</p>
              </div>
            )}
            <DialogFooter className='flex justify-center'>
              <Button
                type='submit'
                className='mt-4 bg-green-500 hover:bg-green-600'
              >
                Envoyer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ProgressPopup
        isOpen={isPopupOpen}
        status={popupStatus}
        creatingMessage={progressMessage}
        successMessage='Fichier importé avec succès !'
        errorMessage={errorMessage}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  )
}

export default FileUploadDialog
