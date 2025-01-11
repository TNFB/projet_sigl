import React from 'react'

interface ProgressPopupProps {
  isOpen: boolean
  status: 'creating' | 'success' | 'error'
  creatingMessage?: string
  successMessage?: string
  errorMessage?: string
  onClose: () => void
}

const ProgressPopup: React.FC<ProgressPopupProps> = ({
  isOpen,
  status,
  creatingMessage = 'Opération en cours...',
  successMessage = 'Opération réussite!',
  errorMessage = "Erreur lors de l'opération",
  onClose,
}) => {
  if (!isOpen) return null

  const getStatusMessage = () => {
    switch (status) {
      case 'creating':
        return creatingMessage
      case 'success':
        return successMessage
      case 'error':
        return errorMessage
      default:
        return ''
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'creating':
        return (
          <div className='loader border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin mx-auto mb-4'></div>
        )
      case 'success':
        return <div className='checkmark text-green-500 text-4xl mb-4'>✔</div>
      case 'error':
        return <div className='error-icon text-red-500 text-4xl mb-4'>✖</div>
      default:
        return null
    }
  }

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-white p-6 rounded-lg text-center'
        onClick={(e) => e.stopPropagation()}
      >
        {getStatusIcon()}
        <p className='text-lg'>{getStatusMessage()}</p>
      </div>
    </div>
  )
}

export default ProgressPopup
