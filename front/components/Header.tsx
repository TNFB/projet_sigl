import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Bell, LogOut, ChevronDown } from 'lucide-react'
import { SIDEBAR_ITEMS, SIDEBAR_ADMIN_ITEMS } from '@/utils/constants'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const Header = () => {
  const [url, setUrl] = useState('Accueil')

  useEffect(() => {
    let path = window.location.pathname
    if (path.endsWith('/')) {
      path = path.slice(0, -1)
    }
    if (path) {
      setUrl(path.charAt(0).toUpperCase() + path.slice(1))
    }
  }, [])
  return (
    <div className='flex items-center justify-between p-4 border-b border-gray-300'>
      <div className='flex items-center space-x-4'>
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Journal de formation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {SIDEBAR_ADMIN_ITEMS.map((item) =>
                  url === item.url ? item.title : null,
                )}
                {SIDEBAR_ITEMS.map((item) =>
                  url === item.url ? item.title : null,
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='flex items-center space-x-4'>
        <button className='p-2 bg-white rounded-full shadow'>
          <Search className='w-5 h-5 text-gray-600' />
        </button>
        <div className='h-6 border-l border-gray-300'></div>
        <button className='p-2 bg-white rounded-full shadow'>
          <Bell className='w-5 h-5 text-gray-600' />
        </button>
        <div className='h-6 border-l border-gray-300'></div>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center'>
            <Avatar className='mr-2'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            User
            <ChevronDown className='size-4' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                onClick={() => {
                  localStorage.clear()
                }}
                href='/Login'
                className='flex items-center'
              >
                Logout
                <LogOut className='ml-2 size-4' />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Header
