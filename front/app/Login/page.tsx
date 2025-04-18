'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { postRequest } from '@/api/api'
import { jwtDecode } from 'jwt-decode'

interface CustomJwtPayload {
  id: number
  email: string
  role: string
  iat: number
  exp: number
}

const Page = () => {
  const router = useRouter()

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token')
      if (token) {
        router.push('/')
      }
    }

    checkToken()
  }, [router])

  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        buttonRef.current?.click()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    const data = {
      email: email,
      password: password,
    }
    postRequest('connection', JSON.stringify({ data: data }))
      .then((response) => {
        console.log('Success:', response)
        const { token } = response
        console.log('Token:', token)

        const decodedToken = jwtDecode<CustomJwtPayload>(token)
        console.log('Decoded Token:', decodedToken)

        localStorage.setItem('token', token)
        localStorage.setItem('role', decodedToken.role)
        localStorage.setItem('email', decodedToken.email)

        console.log('Token:', localStorage.getItem('token'))
        console.log('Role:', localStorage.getItem('role'))
        console.log('Email:', localStorage.getItem('email'))

        router.push('/')
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Identifiant ou mot de passe incorrect')
      })
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[url('/images/eseo_exterieur.png')]">
      <div
        className='w-[420px] bg-transparent border-0 md:border-2 border-white/20 backdrop-blur-[20px] shadow-lg text-white rounded-lg p-8'
        style={{
          boxShadow:
            '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className='flex justify-center mt-5 mb-10'>
          <Image
            src='/images/logo_eseo/ESEO-logo-couleur-positif.png'
            alt='Logo'
            width={300}
            height={200}
            className='object-contain object-center'
          />
        </div>
        <div className='relative w-full my-6'>
          <Input
            type='text'
            placeholder='Identifiant'
            ref={inputRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='relative w-full my-6'>
          <Input
            type='password'
            placeholder='Mot de passe'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          className='w-full h-11 bg-secondary_blue border-none outline-none rounded-full shadow-sm cursor-pointer text-base text-white font-semibold mb-3.5 hover:bg-white hover:text-secondary_blue transition-transform duration-300 transform hover:scale-105'
          onClick={handleSubmit}
          ref={buttonRef}
        >
          Connexion
        </Button>
        <div className='flex justify-center underline text-sm'>
          <a
            href='#'
            className='text-white no-underline hover:text-primary_blue hover:underline decoration-primary_blue'
          >
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </div>
  )
}

export default Page
