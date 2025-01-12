'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Home from '@/components/Home'
import ModifMDP from './modifMDP'
import NewLivrable from './newLivrable'
import AddDoc from './addDoc'

function GestionEleves() {
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
        <div className='flex flex-col space-y-5'>
          <ModifMDP />
        </div>
        <div className='flex flex-col space-y-2'>
          <NewLivrable />
          <AddDoc />
        </div>
      </div>
    </Home>
  )
}

export default GestionEleves
