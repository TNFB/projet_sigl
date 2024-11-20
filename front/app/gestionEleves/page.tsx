'use client'
import React, { useState } from 'react'
import Home from '@/components/Home'
import BaseForm from '@/components/BaseForm'

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
}

function GestionEleves() {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

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
      label: 'Prénom',
      type: 'text',
      name: 'prenom',
      value: formData.prenom,
      onChange: handleChange,
    },
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      value: formData.email,
      onChange: handleChange,
    },
    {
      label: 'Mot de passe',
      type: 'password',
      name: 'password',
      value: formData.password,
      onChange: handleChange,
    },
    {
      label: 'Téléphone',
      type: 'text',
      name: 'telephone',
      value: formData.telephone,
      onChange: handleChange,
    },
  ]

  return (
    <Home>
      <BaseForm title="Gestion des Élèves" onSubmit={handleSubmit} inputFields={inputFields} className="max-w-md mx-auto mt-8" />
    </Home>
  )
}

export default GestionEleves