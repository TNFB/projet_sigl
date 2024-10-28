'use client'
import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#f2f2f2]">
      <p>Redirection vers la page de login...</p>
      <Link href="/Login">
        <p className="text-blue-500 underline">Cliquez ici pour aller à la page de login</p>
      </Link>
    </div>
  );
}