'use client'
import React, { useState } from 'react'
import Home from '@/components/Home'
import BaseForm from '@/components/BaseForm'

interface FormData {
    nom: string;
    date: string;
    type: string;
  }

  interface InputField {
      type: 'input';
      label: string;
      inputType: string;
      name: string;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }

const Page = () => {
    const [formData, setFormData] = useState<FormData>({
        nom: '',
        date: '',
        type: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
          ...formData,
          [name]: value,
        })
    }
    
    //TODO
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }
    type Field = InputField;
    const fields: Field[] = [
        {
          type: 'input',
          label: 'Nom',
          inputType: 'text',
          name: 'nom',
          value: formData.nom,
          onChange: handleChange,
        },
        {
          type: 'input',
          label: 'Date',
          inputType: 'text',
          name: 'date',
          value: formData.date,
          onChange: handleChange,
        },
        {
          type: 'input',
          label: 'Type',
          inputType: 'text',
          name: 'type',
          value: formData.type,
          onChange: handleChange,
        },
      ]

      const fieldsOrder = ['nom','date','type'];
  return (
    <Home>
        empty
        <BaseForm title="Gestion des Livrables" submitLabel="Ajouter" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="h-fit" />
    </Home>
  )
}

export default Page