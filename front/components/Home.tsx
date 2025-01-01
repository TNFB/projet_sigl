'use client'
import React, { ReactNode } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import SideBar from '@/components/sideBar'
import Header from '@/components/Header'

interface HomeProps {
  children: ReactNode
}

const Home = ({ children }: HomeProps) => {
  return (
    <SidebarProvider className="bg-[#f2f2f2]">
      <div className="flex w-screen h-screen">
        <SideBar />
        <div className="flex-1 ml-4 mt-2">
          <Header />
          <main className="p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Home
