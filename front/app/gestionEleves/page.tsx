'use client';
import React, { useState } from 'react';
import Home from '@/components/Home';
import { Input, Button, FormControl, FormLabel, Box, VStack } from '@shadcn/ui';

/* nom, prenom, date_naissance, genre, email, password, telephone */
const Page = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    genre: '',
    email: '',
    password: '',
    telephone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Vous pouvez ajouter ici la logique pour envoyer les données au backend
  };

  return (
    <Home>
      <Box className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[url('/images/eseo_exterieur.png')]">
        <Box className="w-[420px] bg-transparent border-0 md:border-2 border-white/20 backdrop-blur-[20px] shadow-lg text-white rounded-lg p-8">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="nom">Nom</FormLabel>
                <Input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="prenom">Prénom</FormLabel>
                <Input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="date_naissance">Date de naissance</FormLabel>
                <Input
                  type="date"
                  id="date_naissance"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="genre">Genre</FormLabel>
                <Input
                  type="text"
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Mot de passe</FormLabel>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="telephone">Téléphone</FormLabel>
                <Input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue">
                Créer
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Home>
  );
};

export default Page;