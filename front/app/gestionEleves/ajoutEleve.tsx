'use client'
import React, { useState } from 'react'
import BaseForm from '@/components/BaseForm'
import { postRequestCreateUser } from '@/api/api'
import ProgressPopup from '@/components/ProgressPopup'
import bcrypt from 'bcryptjs'

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

function AjoutEleve() {
  const [formData, setFormData] = useState<{
    email: string
    password: string
    name: string
    last_name: string
    telephone: string
    role: string
  }>({
    email: '',
    password: '',
    name: '',
    last_name: '',
    telephone: '',
    role: '',
  })

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [popupStatus, setPopupStatus] = useState<
    'creating' | 'success' | 'error'
  >('creating')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPopupOpen(true)
    setPopupStatus('creating')
    const { email, password, name, last_name, telephone, role } = formData

    if (!email || !password || !name || !last_name || !telephone || !role) {
      console.error('All fields are required')
      return
    }

    try {
      const response = await postRequestCreateUser('user/createUser', {
        ...formData,
        password: password,
      })
      console.log('User created successfully:', response)
      setPopupStatus('success')

      setTimeout(() => {
        setIsPopupOpen(false)
        setFormData({
          email: '',
          password: '',
          name: '',
          last_name: '',
          telephone: '',
          role: 'apprentice',
        })
      }, 2000)
    } catch (error) {
      console.error('Error creating user:', error)
      setErrorMessage("Erreur lors de l'ajout de l'utilisateur")
      setPopupStatus('error')
      setTimeout(() => {
        setIsPopupOpen(false)
      }, 2000)
    }
  }

  const fields: Field[] = [
    {
      type: 'input',
      label: 'Nom',
      inputType: 'text',
      name: 'name',
      value: formData.name,
      onChange: handleChange,
    },
    {
      type: 'input',
      label: 'Prénom',
      inputType: 'text',
      name: 'last_name',
      value: formData.last_name,
      onChange: handleChange,
    },
    {
      type: 'input',
      label: 'Email',
      inputType: 'email',
      name: 'email',
      value: formData.email,
      onChange: handleChange,
    },
    {
      type: 'input',
      label: 'Mot de passe',
      inputType: 'password',
      name: 'password',
      value: formData.password,
      onChange: handleChange,
    },
    {
      type: 'input',
      label: 'Téléphone',
      inputType: 'text',
      name: 'telephone',
      value: formData.telephone,
      onChange: handleChange,
    },
    {
      type: 'select',
      label: 'Rôle',
      name: 'role',
      value: formData.role,
      options: [
        { value: 'admins', label: 'Administrateur' },
        { value: 'apprentices', label: 'Apprenti' },
        { value: 'apprentice_masters', label: "Maitre d'apprentissage" },
        { value: 'educational_tutors', label: 'Tuteur pédagogique' },
      ],
      onChange: handleRoleChange,
    },
  ]

  const fieldsOrder = [
    'email',
    'password',
    'name',
    'last_name',
    'telephone',
    'role',
  ]

  return (
    <div>
      <BaseForm
        title="Ajout d'un utilisateur"
        submitLabel='Ajouter'
        onSubmit={handleSubmit}
        fields={fields}
        fieldsOrder={fieldsOrder}
        className='min-w-80'
      />
      <ProgressPopup
        isOpen={isPopupOpen}
        status={popupStatus}
        creatingMessage="Création de l'utilisateur en cours..."
        successMessage='Utilisateur bien créé !'
        errorMessage={errorMessage}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  )
}

export default AjoutEleve
