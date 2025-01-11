'use client'
import React, { ReactNode, useState, useEffect } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from '@tabler/icons-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { postRequest } from '@/api/api'
import { SIDEBAR_ITEMS, SIDEBAR_ADMIN_ITEMS } from '@/utils/constants'
import Header from './Header'

interface HomeProps {
  children: ReactNode
}

interface Student {
  id_user: number
  prenom: string
  nom: string
  email: string
}

const Home = ({ children }: HomeProps) => {
  const [userType, setUserType] = useState<
    | 'apprentices'
    | 'admins'
    | 'apprenticeship_coordinators'
    | 'apprentice_masters'
    | 'educational_tutors'
  >('apprentices')
  const [email, setEmail] = useState<string | null>(null)
  const [students, setStudents] = useState<Student[]>([])

  const fetchStudents = React.useCallback(async (url: string) => {
    try {
      const response = await postRequest(url);
      if (response.redirect) {
        window.location.href = '/Login';
      } else {
        const apprentices = Array.isArray(response) ? response : response.apprentis || [];

        const formattedApprentices = apprentices.map((apprentice: any) => ({
          id_user: apprentice.id_user,
          email: apprentice.email,
          nom: apprentice.nom,
          prenom: apprentice.prenom,
        }));
        setStudents(formattedApprentices);
        console.log('Success:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  useEffect(() => {
    const userRole = localStorage.getItem('role') as
      | 'apprentices'
      | 'admins'
      | 'apprentice_masters'
      | 'educational_tutors'
      | null
    const storedEmail = localStorage.getItem('email')
    setEmail(storedEmail)
    setUserType(userRole ?? 'apprentices')
  }, [])

  useEffect(() => {
    if (email) {
      switch (userType) {
        case 'apprentice_masters':
          fetchStudents('apprenticeMaster/getApprenticesByMasterEmail')
          break
        case 'educational_tutors':
          fetchStudents('educationalTutor/getApprenticesByTutorEmail')
          break
        default:
          break
      }
    }
  }, [userType, email, fetchStudents])

  const transformStudentsToSidebarItems = (students: Student[]) => {
    const items = students.map((student) => ({
      label: `${student.nom} ${student.prenom}`,
      href: `/student/${student.id_user}`,
      icon: 'UsersRound',
    }))
    return [
      {
        label: 'Accueil',
        href: '/',
        icon: 'Home',
      },
      ...items,
    ]
  }

  const getSidebarItems = (userType: string) => {
    switch (userType) {
      case 'admins':
        return SIDEBAR_ADMIN_ITEMS
      case 'apprentice_masters':
        return transformStudentsToSidebarItems(students)
      case 'educational_tutors':
        return transformStudentsToSidebarItems(students)
      default:
        return SIDEBAR_ITEMS
    }
  }

  const links = getSidebarItems(userType)
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row bg-gray-200 dark:bg-neutral-800 w-screen flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'h-screen',
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className='justify-between gap-10'>
          <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
            <>
              <Logo open={open} />
            </>
            <AnimatePresence>
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                className={cn(
                  'mt-8 flex flex-col gap-2',
                  open ? 'ml-4' : 'items-center',
                )}
              >
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className='flex-1 rounded-tl-2xl bg-gray-100'>
        <Header />
        <main className='p-4'>{children}</main>
      </div>
    </div>
  )
}
interface LogoProps {
  open: boolean
}

export const Logo = ({ open }: LogoProps) => {
  return (
    <Link
      href='/'
      className='font-normal flex flex-col items-center text-sm text-black py-1 relative z-20'
    >
      <Image
        src={
          open
            ? '/images/logo_eseo/ESEO-logo-couleur-positif.png'
            : '/images/logo_eseo/ESEO-picto-couleur.png'
        }
        alt='logo'
        width={open ? 140 : 40}
        height={1}
      />
    </Link>
  )
}

export default Home
