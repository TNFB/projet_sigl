'use client'
import React, { useState } from 'react'
import BaseForm from '@/components/BaseForm'
import { postRequestCreateUser } from '@/api/api'
import bcrypt from 'bcryptjs'

// Définissez ces interfaces avant de les utiliser
interface InputField {
  type: 'input';
  label: string;
  inputType: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SelectField {
  type: 'select';
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

type Field = InputField | SelectField;

function AjoutEleve() {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    name: string;
    last_name: string;
    telephone: string;
    role: string;
  }>({
    email: '',
    password: '',
    name: '',
    last_name: '',
    telephone: '',
    role: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, name, last_name, telephone, role } = formData;

    if (!email || !password || !name || !last_name || !telephone || !role) {
      console.error('All fields are required');
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const response = await postRequestCreateUser('user/createUser', {
        ...formData,
        password: hashedPassword,
      });
      console.log('User created successfully:', response);
      alert('Utilisateur ajouté avec succès');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };
  
  const fields: Field[] = [
    {
      type: 'input',
      label: 'Nom',
      inputType: 'text',
      name: 'name',
      value: formData.name,
      onChange: handleChange,
    },
    {
      type: 'input',
      label: 'Prénom',
      inputType: 'text',
      name: 'last_name',
      value: formData.last_name,
      onChange: handleChange,
    },
    {
      type: 'input',
      label: 'Email',
      inputType: 'email',
      name: 'email',
      value: formData.email,
      onChange: handleChange,
    },
    {
      type: 'input',
      label: 'Mot de passe',
      inputType: 'password',
      name: 'password',
      value: formData.password,
      onChange: handleChange,
    },
    {
      type: 'input',
      label: 'Téléphone',
      inputType: 'text',
      name: 'telephone',
      value: formData.telephone,
      onChange: handleChange,
    },
    {
      type: 'select',
      label: 'Rôle',
      name: 'role',
      value: formData.role,
      options: [
        { value: 'admins', label: 'Administrateur' },
        { value: 'apprentices', label: 'Apprenti' },
        { value: 'apprentice_masters', label: 'Maitre d\'apprentissage' },
        { value: 'educational_tutors', label: 'Tuteur pédagogique' },
        { value: 'apprenticeship_coordinators', label: 'Coordinatrice alternance' },
      ],
      onChange: handleRoleChange,
    },
  ];

  const fieldsOrder = ['email', 'password', 'name', 'last_name', 'telephone', 'role'];

  return (
    <BaseForm title="Ajout d'un utilisateur" submitLabel="Ajouter" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="min-w-80" />
  );
}

export default AjoutEleve;