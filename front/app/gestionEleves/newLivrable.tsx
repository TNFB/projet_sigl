'use client'
import React, { useState } from 'react'
import BaseForm from '@/components/BaseForm'
import { postRequest } from '@/api/api'

interface FormData {
  deposit: string
}

// Définissez ces interfaces
interface InputField {
  type: 'input'
  label: string
  inputType: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface SelectField {
  type: 'select'
  label: string
  name: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

type Field = InputField | SelectField

const NewLivrable = () => {
  const [formData, setFormData] = useState<FormData>({
    deposit: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data = {
        deposit: formData.deposit,
      }

      postRequest('deposit/addDeposit', JSON.stringify({ data: data })).then(
        (response) => {
          console.log('deposit created successfully:', response)
          alert('Livrable ajouté avec succès')
          //Here can get return opf response
          // exemple : const { somthing } = response;
        },
      )

      /*const response = await postRequest('deposit/addDeposit', JSON.stringify(formData));
      console.log('deposit created successfully:', response);
      alert('Livrable ajouté avec succès');*/
    } catch (error) {
      console.error('Error create deposit:', error)
      alert("Erreur lors de l'ajout du livrable")
    }
  }

  const fields: Field[] = [
    {
      type: 'input',
      label: 'Nom du livrable',
      inputType: 'text',
      name: 'deposit',
      value: formData.deposit,
      onChange: handleChange,
    },
  ]

  const fieldsOrder = ['deposit']

  return (
    <BaseForm
      title="Ajout d'un nouveau livrable"
      submitLabel='Ajouter'
      onSubmit={handleSubmit}
      fields={fields}
      fieldsOrder={fieldsOrder}
      className='h-fit'
    />
  )
}

export default NewLivrable
