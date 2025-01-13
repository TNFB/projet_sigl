'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BaseMultiAjout from '@/components/BaseMultiAjout'
import { postRequest } from '@/api/api'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { AutoComplete, type Option } from '@/components/autoComplete'

type User = {
  id: string
  name: string
  last_name: string
  email: string
  role: string
  entreprise?: string
  promotion?: string
  telephone?: string
}

export default function GestionEquipes() {
  const [users, setUsers] = useState<User[]>([])
  const [apprentices, setApprentices] = useState<User[]>([])
  const [apprenticeMasters, setApprenticeMasters] = useState<User[]>([])
  const [educationalTutors, setEducationalTutors] = useState<User[]>([])
  const [rows, setRows] = useState([
    { alternant: '', tuteur: '', maitre_apprentissage: '' },
  ])
  const [isMultiAddOpen, setIsMultiAddOpen] = useState(false)

  const toggleMultiAdd = () => {
    setIsMultiAddOpen(!isMultiAddOpen)
  }

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = {
          role: null,
          detailed: 'true',
        }
        const response = await postRequest(
          'user/getUserEmailsByRole',
          JSON.stringify({ data: data }),
        )
        const formattedUsers = response.users.map((user: any) => ({
          id: user.id_user,
          name: `${user.name} ${user.last_name}`,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          entreprise: user.entreprise_name || '',
          promotion: user.promotion_name || '',
          telephone: user.telephone || '',
        }))
        setUsers(formattedUsers)
      } catch (error) {
        console.error('Error fetching emails:', error)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const apprentices = users.filter((user) => user.role === 'apprentices')
    const apprenticeMasters = users.filter(
      (user) => user.role === 'apprentice_masters',
    )
    const educationalTutors = users.filter(
      (user) => user.role === 'educational_tutors',
    )

    setApprentices(apprentices)
    setApprenticeMasters(apprenticeMasters)
    setEducationalTutors(educationalTutors)
  }, [users])

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
    if (rows.length < 4) {
      setRows([
        ...rows,
        { alternant: '', tuteur: '', maitre_apprentissage: '' },
      ])
    } else {
      alert('Vous ne pouvez ajouter que 4 lignes de saisie au maximum.')
    }
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
      console.log('Data:', data)

      postRequest('admin/linkApprentice', JSON.stringify({ data: data })).then(
        (response) => {
          console.log('Success:', response)
          alert('Équipe(s) ajoutée(s) avec succès')
        },
      )
    } catch (error) {
      console.error('Error:', error)
      alert("Erreur lors de l'ajout de l'équipe")
    }
  }
  const [value, setValue] = useState<Option>()

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
    <div className='p-4 w-full'>
      <div
        className='bg-gray-200 p-2 cursor-pointer w-full text-left flex items-center'
        onClick={toggleMultiAdd}
      >
        {isMultiAddOpen ? (
          <ChevronDown className='mr-2' />
        ) : (
          <ChevronRight className='mr-2' />
        )}
        Ajout équipe pédagogique
      </div>
      <div
        className={`transition-all duration-500 ease-in-out ${
          isMultiAddOpen
            ? 'max-h-screen opacity-100 overflow-visible'
            : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <BaseMultiAjout
          typeAjout='Équipe tutorale n°'
          submitLabel='Ajouter'
          rows={rows}
          onChange={handleChange}
          addRow={addRow}
          onSubmit={handleSubmit}
          options={{
            alternant: apprentices.map((user) => ({
              value: user.email,
              label: `${user.name} ${user.last_name}`,
            })),
            tuteur: educationalTutors.map((user) => ({
              value: user.email,
              label: `${user.name} ${user.last_name}`,
            })),
            maitre_apprentissage: apprenticeMasters.map((user) => ({
              value: user.email,
              label: `${user.name} ${user.last_name}`,
            })),
          }}
        />
      </div>
    </div>
  )
}
