'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Home from '@/components/Home'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ResponsiveGridLayout = WidthProvider(Responsive)

const initialLayout = [
  { i: '1', x: 0, y: 0, w: 2, h: 1 },
  { i: '2', x: 2, y: 0, w: 1, h: 2 },
  { i: '3', x: 3, y: 0, w: 1, h: 2 },
  { i: '4', x: 0, y: 1, w: 2, h: 2 },
  { i: '5', x: 2, y: 2, w: 3, h: 3 },
]

export default function Accueil() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')
    if (!token && role !== 'apprentices') {
      localStorage.clear()
      router.push('/Login')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const [layout, setLayout] = useState(initialLayout)

  interface LayoutItem {
    i: string
    x: number
    y: number
    w: number
    h: number
  }

  const handleLayoutChange = (newLayout: LayoutItem[]) => {
    setLayout(newLayout)
  }

  const handleDragStart = () => {
    document.body.style.userSelect = 'none'
  }

  const handleDragEnd = () => {
    document.body.style.userSelect = 'auto'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
          <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
          <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <Home>
      <div className="p-4 h-[calc(100vh-64px)] overflow-auto">
        <Button onClick={() => setLayout(initialLayout)}>
          Réinitialiser la grille
        </Button>
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 5, md: 5, sm: 5, xs: 5, xxs: 5 }}
          rowHeight={100}
          width={1200}
          onLayoutChange={handleLayoutChange}
          onDragStart={handleDragStart}
          onDragStop={handleDragEnd}
          isDraggable={true}
          draggableHandle=".draggable-handle"
        >
          <div key="1" data-grid={{ x: 0, y: 0, w: 2, h: 1 }}>
            <Card className="h-full">
              <CardHeader className="draggable-handle cursor-move">
                <CardTitle>Evenements à venir</CardTitle>
              </CardHeader>
              <CardContent className="relative h-full">
                <p>Mardi 31 Mars 2025</p>
                <br />
                <p>Rendu rapport intermédiaire</p>
              </CardContent>
            </Card>
          </div>
          <div key="2" data-grid={{ x: 2, y: 0, w: 1, h: 2 }}>
            <Card className="h-full">
              <CardHeader className="draggable-handle cursor-move">
                <CardTitle>Notes importantes</CardTitle>
              </CardHeader>
              <CardContent className="relative h-full">
                <p>Note 1</p>
                <p>Note 2</p>
                <p>Note 3</p>
              </CardContent>
            </Card>
          </div>
          <div key="3" data-grid={{ x: 3, y: 0, w: 1, h: 2 }}>
            <Card className="h-full">
              <CardHeader className="draggable-handle cursor-move">
                <CardTitle>Rappels</CardTitle>
              </CardHeader>
              <CardContent className="relative h-full">
                <p>Rappel 1</p>
                <p>Rappel 2</p>
              </CardContent>
            </Card>
          </div>
          <div key="4" data-grid={{ x: 0, y: 1, w: 2, h: 2 }}>
            <Card className="h-full">
              <CardHeader className="draggable-handle cursor-move">
                <CardTitle>Documents récents</CardTitle>
              </CardHeader>
              <CardContent className="relative h-full">
                <p>Document 1</p>
                <p>Document 2</p>
              </CardContent>
            </Card>
          </div>
          <div key="5" data-grid={{ x: 2, y: 2, w: 3, h: 3 }}>
            <Card className="h-full">
              <CardHeader className="draggable-handle cursor-move">
                <CardTitle>Projets en cours</CardTitle>
              </CardHeader>
              <CardContent className="relative h-full">
                <p>Projet 1</p>
                <p>Projet 2</p>
              </CardContent>
            </Card>
          </div>
        </ResponsiveGridLayout>
      </div>
    </Home>
  )
}
