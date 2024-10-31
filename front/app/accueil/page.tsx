'use client'
import React from 'react'
import Home from '../page'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Accueil() {
  return (
    <Home>
      <div className="relative">
        {/* Dessiner la grille en arrière-plan */}
        <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-4 pointer-events-none">
          {Array.from({ length: 25 }).map((_, index) => (
            <div key={index} className="border-4 border-red-500 h-full w-full"></div>
          ))}
        </div>

        {/* Positionner les cartes par-dessus la grille */}
        <div className="relative grid grid-cols-5 grid-rows-5 gap-4">
          {/* Card 1 */}
          <Card className="col-span-2 row-span-1">
            <CardHeader>
              <CardTitle>Evenements à venir</CardTitle>
            </CardHeader>
            <CardContent className="relative h-full">
              <p>Mardi 31 Mars 2025 </p>
              <br />
              <p>Rendu rapport intermédiaire</p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="col-span-1 row-span-2">
            <CardHeader>
              <CardTitle>Notes importantes</CardTitle>
            </CardHeader>
            <CardContent className="relative h-full">
              <p>Note 1</p>
              <p>Note 2</p>
              <p>Note 3</p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="col-span-1 row-span-2">
            <CardHeader>
              <CardTitle>Rappels</CardTitle>
            </CardHeader>
            <CardContent className="relative h-full">
              <p>Rappel 1</p>
              <p>Rappel 2</p>
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card className="col-span-2 row-span-2">
            <CardHeader>
              <CardTitle>Documents récents</CardTitle>
            </CardHeader>
            <CardContent className="relative h-full">
              <p>Document 1</p>
              <p>Document 2</p>
            </CardContent>
          </Card>

          {/* Card 5 */}
          <Card className="col-span-3 row-span-3">
            <CardHeader>
              <CardTitle>Projets en cours</CardTitle>
            </CardHeader>
            <CardContent className="relative h-full">
              <p>Projet 1</p>
              <p>Projet 2</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Home>
  );
}