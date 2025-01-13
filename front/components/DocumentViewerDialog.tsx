import React, { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DocumentViewerDialogProps {
  open: boolean
  onClose: () => void
  documentUrl: string
  documentName: string
}

const DocumentViewerDialog: React.FC<DocumentViewerDialogProps> = ({
  open,
  onClose,
  documentUrl,
  documentName,
}) => {
  useEffect(() => {
    console.log('Document URL:', documentUrl)
  }, [documentUrl])

  const isOfficeDocument =
    documentUrl.endsWith('.docx') ||
    documentUrl.endsWith('.xlsx') ||
    documentUrl.endsWith('.pptx')
  const viewerUrl = isOfficeDocument
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documentUrl)}`
    : documentUrl

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>{documentName}</DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <iframe
            src={viewerUrl}
            width='100%'
            height='600px'
            title={documentName}
            onLoad={() => console.log('Iframe loaded')}
            onError={() => console.log('Iframe error')}
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentViewerDialog
