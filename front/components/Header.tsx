import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, LogOut, ChevronDown, User } from 'lucide-react'
import { SIDEBAR_ITEMS, SIDEBAR_ADMIN_ITEMS } from '@/utils/constants'
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
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('email')
      setEmail(storedEmail)
    }

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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Journal de formation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {SIDEBAR_ADMIN_ITEMS.map((item) =>
                  url === item.href ? item.label : null,
                )}
                {SIDEBAR_ITEMS.map((item) =>
                  url === item.href ? item.label : null,
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='flex items-center space-x-4'>
        <div className='h-6 border-l border-gray-300'></div>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center'>
            <Avatar className='p-2 bg-white rounded-full shadow mr-2'>
              <User className='w-6 h-6 text-gray-600' />
            </Avatar>
            {email}
            <ChevronDown className='size-4' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href='/profile' className='w-full'>
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                onClick={() => {
                  localStorage.clear()
                }}
                href='/Login'
                className='flex items-center'
              >
                Déconnexion
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
