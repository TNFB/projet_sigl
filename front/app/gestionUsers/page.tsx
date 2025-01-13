'use client'
import React, { useEffect, useState } from 'react'
import Home from '@/components/Home'
import UserTable from '@/components/table/UserTable'
import GestionEquipes from '../gestionEquipes/page'
import { postRequest } from '@/api/api'

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

export default function GestionUsers() {
  const [users, setUsers] = useState<User[]>([])

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

  const handleUserDelete = (userEmail: string) => {
    setUsers(users.filter((user) => user.email !== userEmail))
  }
  return (
    <Home>
      <GestionEquipes />
      <UserTable usersData={users} onUserDelete={handleUserDelete} />
    </Home>
  )
}
