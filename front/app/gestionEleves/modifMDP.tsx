'use client'
import React, { useState, useEffect } from 'react'
import BaseForm from '@/components/BaseForm'
import { postRequest } from '@/api/api'

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
        }

        postRequest(
          'user/getUserEmailsByRole',
          JSON.stringify({ data: data }),
        ).then((response) => {
          console.log('get User Email by Roles successfull:', response)
          //Here can get return opf response
          // exemple : const { somthing } = response;
          const emailOptions = response.emails.map((email: string) => ({
            value: email,
            label: email,
          }))
          setEmails(emailOptions)
        })
        //const response = await postRequest('user/getUserEmailsByRole?role');
        //const emailOptions = response.emails.map((email: string) => ({
        //  value: email,
        //  label: email,
        //}));
        //setEmails(emailOptions);
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
    try {
      const data = {
        email: formData.email,
        newPassword: formData.password,
      }

      postRequest(
        'admin/overritePassword',
        JSON.stringify({ data: data }),
      ).then((response) => {
        console.log('OverritePassword successfull:', response)
        alert('Mot de passe modifié avec succès')
        //Here can get return opf response
        // exemple : const { somthing } = response;
      })
      /*
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      postRequest('admin/overritePassword', JSON.stringify({ email: formData.email, newPassword: hashedPassword }))
        .then(response => {
        console.log('Success:', response);
          alert('Mot de passe modifié avec succès');
      })*/
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de la modification du mot de passe')
    }
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
  )
}

export default ModifMDP
