import React, { useState, useEffect } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Home, CheckSquare, FileText, BookOpen, Clipboard } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar"
import Image from 'next/image'
import Link from 'next/link'
import { SIDEBAR_ITEMS } from '@/utils/constants'

const SideBar = () => {
  const [activeItem, setActiveItem] = useState("Accueil")

  useEffect(() => {
    let path = window.location.pathname
    if (path.endsWith('/')) {
      path = path.slice(0, -1)
    }
    console.log(path)
    if (path) {
      setActiveItem(path.charAt(0).toUpperCase() + path.slice(1))
    }
  }, [])

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
              {SIDEBAR_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.url}
                      className={`flex items-center space-x-2 p-2 rounded-lg ${activeItem === item.url ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                      onClick={() => setActiveItem(item.title)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default SideBar