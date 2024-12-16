'use client'
import React, { useState } from 'react'
import Home from '@/components/Home'
import BaseForm from '@/components/BaseForm'

interface FormData {
    nom: string;
    date: string;
    type: string;
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
        console.log(formData)
    }

    const inputFields = [
        {
          label: 'Nom',
          type: 'text',
          name: 'nom',
          value: formData.nom,
          onChange: handleChange,
        },
        {
          label: 'Date',
          type: 'date',
          name: 'date',
          value: formData.date,
          onChange: handleChange,
        },
        {
          label: 'Type',
          type: 'text',
          name: 'type',
          value: formData.type,
          onChange: handleChange,
        },
      ]

  return (
    <Home>
        <BaseForm title="Gestion des Livrables" onSubmit={handleSubmit} inputFields={inputFields} className="max-w-md mx-auto mt-8" />
    </Home>
  )
}

export default Page