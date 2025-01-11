'use client'
import React, { useState, useEffect } from 'react'
import BaseForm from '@/components/BaseForm'
import { postRequest } from '@/api/api'
import ProgressPopup from '@/components/ProgressPopup'

interface FormData {
  email: string
  password: string
}

interface SelectField {
  type: 'select'
  label: string
  name: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

function ModifMDP() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })

  const [emails, setEmails] = useState<{ value: string; label: string }[]>([])
  const [showPassword, setShowPassword] = useState(false)

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupStatus, setPopupStatus] = useState<
    'creating' | 'success' | 'error'
  >('creating')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleUserChange = (value: string) => {
    setFormData({
      ...formData,
      email: value,
    })
  }

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const data = {
          role: null,
          detailed: 'false',
        }

        postRequest(
          'user/getUserEmailsByRole',
          JSON.stringify({ data: data }),
        ).then((response) => {
          console.log('get User Email by Roles successfull:', response)
          const emailOptions = response.emails.map((email: string) => ({
            value: email,
            label: email,
          }))
          setEmails(emailOptions)
        })
      } catch (error) {
        console.error('Error fetching emails:', error)
      }
    }

    fetchEmails()
  }, [])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      password: e.target.value,
    })
  }

  const generatePassword = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({
      ...formData,
      password,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPopupOpen(true)
    setPopupStatus('creating')

    try {
      const data = {
        email: formData.email,
        newPassword: formData.password,
      }

      const response = await postRequest(
        'admin/overritePassword',
        JSON.stringify({ data: data }),
      )

      if (response.status === 422) {
        setErrorMessage('Le mot de passe ne peut pas être le même')
        setPopupStatus('error')
      } else {
        console.log('OverritePassword successful:', response)
        setPopupStatus('success')

        setTimeout(() => {
          setIsPopupOpen(false)
          setFormData({
            email: '',
            password: '',
          })
        }, 2000)
      }
    } catch (error) {
      console.error('Error:', error)
      if (error.response && error.response.status === 422) {
        setErrorMessage('Le mot de passe ne peut pas être le même')
      } else {
        setErrorMessage('Erreur lors de la modification du mot de passe')
      }
      setPopupStatus('error')
    }

    setTimeout(() => {
      setIsPopupOpen(false)
    }, 2000)
  }

  type Field = SelectField
  const fields: Field[] = [
    {
      type: 'select',
      label: 'Email',
      name: 'email',
      value: formData.email,
      options: emails,
      onChange: handleUserChange,
    },
  ]

  const fieldsOrder = ['email']

  return (
    <div>
      <BaseForm
        title='Modification MDP utilisateur'
        submitLabel='Modifier'
        onSubmit={handleSubmit}
        fields={fields}
        fieldsOrder={fieldsOrder}
        className='h-fit'
      >
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Mot de passe
          </label>
          <div className='flex'>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              value={formData.password}
              onChange={handlePasswordChange}
              className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
            <button
              type='button'
              onClick={generatePassword}
              className='ml-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <span role='img' aria-label='generate'>
                🔄
              </span>
            </button>
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='ml-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <span role='img' aria-label='show-password'>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </button>
          </div>
        </div>
      </BaseForm>
      <ProgressPopup
        isOpen={isPopupOpen}
        status={popupStatus}
        creatingMessage='Modification du mot de passe en cours...'
        successMessage='Mot de passe modifié avec succès !'
        errorMessage={errorMessage}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  )
}

export default ModifMDP
