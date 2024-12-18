import React, { useState, useEffect } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Home, CheckSquare, FileText, BookOpen, Clipboard } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar"
import Image from 'next/image'
import Link from 'next/link'
import { SIDEBAR_ITEMS, SIDEBAR_ADMIN_ITEMS, SIDEBAR_CA_ITEMS } from '@/utils/constants'
import { ICONS } from '@/utils/iconMapping'
import { postRequest } from '@/api/api';

const SideBar = () => {
  const [activeItem, setActiveItem] = useState("Accueil")
  const [userType, setUserType] = useState<'apprentices' | 'admins' | 'apprenticeship_coordinators'>('apprentices')
  const [email, setEmail] = useState<string | null>(null)
  const [students, setStudents] = useState([])

  const fetchStudents = async (url: string) => {
    const formattedData = {
      data: {
        email: email
      }
    }
    postRequest(url, JSON.stringify(formattedData))
      .then(response => {
        const apprentices = response.apprentis
        setStudents(apprentices)
        console.log('Success:', response)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }


  useEffect(() => {
    const userRole = localStorage.getItem('role') as 'apprentices' | 'admins' | 'apprenticeship_coordinators' | null
    const storedEmail = localStorage.getItem('email')
    setEmail(storedEmail)
    setUserType(userRole ?? 'apprentices')
    //setUserType('admin')
    let path = window.location.pathname
    if (path.endsWith('/')) {
      path = path.slice(0, -1)
    }
    if (path) {
      setActiveItem(path.charAt(0).toUpperCase() + path.slice(1))
    }
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
  }, [userType, email])

  const transformStudentsToSidebarItems = (students) => {
    const items = students.map((student) => ({
      title: `${student.prenom} ${student.nom}`,
      url: '/',
      icon: 'UsersRound',
    }))
    return [
      {
        title: "Accueil",
        url: "/",
        icon: "Home",
      },
      ...items
    ]
  }

  const getSidebarItems = (userType: string) => {
    switch (userType) {
      case 'admins':
        return SIDEBAR_ADMIN_ITEMS
      case 'apprenticeship_coordinators':
        return SIDEBAR_CA_ITEMS
      case 'apprentices':
        return SIDEBAR_ITEMS
      case 'apprentice_masters':
        return transformStudentsToSidebarItems(students)
      case 'educational_tutors':
        return transformStudentsToSidebarItems(students)
      default:
        return SIDEBAR_ITEMS
    }
  }

  const items = getSidebarItems(userType)

  return (
    <Sidebar className="bg-[#fafafa] ml-2 mt-2 rounded-lg shadow-lg">
      <SidebarHeader className='mb-12'>
        <Image src="/images/logo_eseo/ESEO-logo-couleur-positif.png" alt="logo" width={200} height={1} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='p-2 border-b-2 border-gray-300'>
              {items.map((item) => {
                const Icon = ICONS[item.icon as keyof typeof ICONS]
                return(
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.url}
                      className={`flex items-center space-x-2 p-2 rounded-lg ${activeItem === item.url ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                      onClick={() => setActiveItem(item.title)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default SideBar