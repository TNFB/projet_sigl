"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Home from '@/components/Home'

const formSchema = z.object({
  nom: z.string().min(2, { message: "Nom doit contenir au moins 2 caractères." }),
  prenom: z.string().min(2, { message: "Prénom doit contenir au moins 2 caractères." }),
  date_naissance: z.string().nonempty({ message: "Date de naissance est requise." }),
  genre: z.string().nonempty({ message: "Genre est requis." }),
  email: z.string().email({ message: "Email invalide." }),
  password: z.string().min(6, { message: "Mot de passe doit contenir au moins 6 caractères." }),
  telephone: z.string().nonempty({ message: "Téléphone est requis." })
})

export default function GestionEleves() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      date_naissance: '',
      genre: '',
      email: '',
      password: '',
      telephone: ''
    }
  })

  const onSubmit = async (data: {
    nom: string;
    prenom: string;
    date_naissance: string;
    genre: string;
    email: string;
    password: string;
    telephone: string;
  }) => {
    try {
      // Convertir la date de naissance en chaîne de caractères au format ISO 8601
      const formattedData = {
        ...data,
        date_naissance: new Date(data.date_naissance).toISOString()
      };

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/acteur/`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      // Vous pouvez ajouter ici la logique pour gérer la réponse du backend
    } catch (error) {
      console.error('Error:', error);
      // Vous pouvez ajouter ici la logique pour gérer les erreurs
    }
  }

  return (
    <Home>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Ajout d un user</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Nom</FormLabel>
                    <FormControl>
                      <Input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Prénom</FormLabel>
                    <FormControl>
                      <Input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_naissance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Date de Naissance</FormLabel>
                    <FormControl>
                      <Input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Genre</FormLabel>
                    <FormControl>
                      <Input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Genre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Mot de passe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700">Téléphone</FormLabel>
                    <FormControl>
                      <Input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Soumettre</Button>
            </form>
          </Form>
        </div>
      </div>
    </Home>
  )
}