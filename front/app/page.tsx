'use client'
import './globals.css'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Home from '@/components/Home'
import { Responsive, WidthProvider } from 'react-grid-layout'

export default function Accueil() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState<string | undefined>()

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    if (storedRole) {
      setRole(storedRole)
    }
    const token = localStorage.getItem('token')
    if (!token || !storedRole) {
      localStorage.clear()
      router.push('/Login')
    } else if (storedRole === 'admins') {
      router.push('/gestionUsers')
    } else if (storedRole === 'apprentices') {
      router.push('/accueilApprenti')
    } else {
      setIsLoading(false)
    }
  }, [router])

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
      <div className='flex items-center justify-center min-h-screen'>
        <h1 className='text-6xl font-bold text-center text-gray-500'>
          Bienvenue sur la gestion
          <br />
          de vos apprentis
        </h1>
      </div>
    </Home>
  )
}
