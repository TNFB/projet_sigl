'use client'
import React, { useState } from 'react'
import Home from '../page'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ResponsiveGridLayout = WidthProvider(Responsive)

const initialLayout = [
  { i: '1', x: 0, y: 0, w: 2, h: 1 },
  { i: '2', x: 2, y: 0, w: 1, h: 2 },
  { i: '3', x: 3, y: 0, w: 1, h: 2 },
  { i: '4', x: 0, y: 1, w: 2, h: 2 },
  { i: '5', x: 2, y: 2, w: 3, h: 3 },
]

export default function Accueil() {
  const [layout, setLayout] = useState(initialLayout)

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout)
  }

  const handleDragStart = () => {
    document.body.style.userSelect = 'none'
  }

  const handleDragEnd = () => {
    document.body.style.userSelect = 'auto'
  }

  return (
    <Home>
      <div className="p-4">
        <Button onClick={() => setLayout(initialLayout)}>Réinitialiser la grille</Button>
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
        >
          <div key="1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Evenements à venir</CardTitle>
              </CardHeader>
              <CardContent className="relative h-full">
                <p>Mardi 31 Mars 2025 </p>
                <br />
                <p>Rendu rapport intermédiaire</p>
              </CardContent>
            </Card>
          </div>
          <div key="2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Notes importantes</CardTitle>
              </CardHeader>
              <CardContent className="relative h-full">
                <p>Note 1</p>
                <p>Note 2</p>
                <p>Note 3</p>
              </CardContent>
            </Card>
          </div>
          <div key="3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Rappels</CardTitle>
              </CardHeader>
              <CardContent className="relative h-full">
                <p>Rappel 1</p>
                <p>Rappel 2</p>
              </CardContent>
            </Card>
          </div>
          <div key="4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Documents récents</CardTitle>
              </CardHeader>
              <CardContent className="relative h-full">
                <p>Document 1</p>
                <p>Document 2</p>
              </CardContent>
            </Card>
          </div>
          <div key="5">
            <Card className="h-full">
              <CardHeader>
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