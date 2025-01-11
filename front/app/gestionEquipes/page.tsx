'use client'
import Home from '@/components/Home'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BaseMultiAjout from '@/components/BaseMultiAjout'
import { postRequest } from '@/api/api'

const GestionEquipes = () => {
  const [rows, setRows] = useState([
    { alternant: '', tuteur: '', maitre_apprentissage: '' },
  ])

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')
    if (!token && role !== 'admins') {
      localStorage.clear()
      router.push('/Login')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    fieldName: string,
  ) => {
    const newRows = rows.map((row, i) =>
      i === rowIndex ? { ...row, [fieldName]: e.target.value } : row,
    )
    setRows(newRows)
  }

  const addRow = () => {
    setRows([...rows, { alternant: '', tuteur: '', maitre_apprentissage: '' }])
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data = {
        peopleData: rows.map((row) => ({
          apprenticeEmail: row.alternant,
          masterEmail: row.maitre_apprentissage,
          tutorEmail: row.tuteur,
        })),
      }

      postRequest(
        'ApprenticeshipCoordinator/linkApprentice',
        JSON.stringify({ data: data }),
      ).then((response) => {
        if (response.redirect) {
          window.location.href = '/Login';
        } else {
          console.log('Success:', response)
          alert('Équipe(s) ajoutée(s) avec succès')
        }
        
      })
    } catch (error) {
      console.error('Error:', error)
      alert("Erreur lors de l'ajout de l'équipe")
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='flex space-x-2 animate-pulse'>
          <div className='w-8 h-8 bg-blue-400 rounded-full'></div>
          <div className='w-8 h-8 bg-blue-400 rounded-full'></div>
          <div className='w-8 h-8 bg-blue-400 rounded-full'></div>
        </div>
      </div>
    )
  }

  return (
    <Home>
      <div className='flex space-x-4 p-4 w-fit'>
        <BaseMultiAjout
          title='Ajout de tuteur(s) pédagogique(s)'
          typeAjout='Équipe tutorale n°'
          submitLabel='Ajouter'
          rows={rows}
          onChange={handleChange}
          addRow={addRow}
          onSubmit={handleSubmit}
          className='mx-auto mt-8'
        />
      </div>
    </Home>
  )
}

export default GestionEquipes
