'use client';
import React from 'react';
import Home from '@/components/Home';

/* nom, prenom, date_naissance, genre, email, password, telephone */
const Page = () => {
  /*const [formData, setFormData] = useState({
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
  };*/

  return (
    <Home>
      gestion des éleves
    </Home>
  );
};

export default Page;