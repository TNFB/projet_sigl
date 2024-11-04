'use client'
import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import SideBar from "@/components/sideBar"
import Header from '@/components/Header'

import { ReactNode } from 'react';

interface HomeProps {
  children: ReactNode;
}

export default function Home({ children }: HomeProps) {


  return (
    <SidebarProvider className='bg-[#f2f2f2]'>
      <div className="flex w-screen h-screen">
        <SideBar />
        <div className='flex-1 ml-4 mt-2'>
          <Header />
          <main className='p-4'>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}