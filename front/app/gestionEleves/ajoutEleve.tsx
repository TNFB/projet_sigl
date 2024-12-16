import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';
import { postRequestCreateUser } from '@/api/api';

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



function AjoutEleve() {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    name: string;
    lastName: string;
    telephone: string;
    role: string;
  }>({
    email: '',
    password: '',
    name: '',
    lastName: '',
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
    // Validation simple (Potentiellement a delete)
    const { email, password, name, lastName, telephone, role } = formData;
    if (!email || !password || !name || !lastName || !telephone || !role) {
      console.error('All fields are required');
      return;
    }

    try {
      const response = await postRequestCreateUser('user/createUser', formData);
      console.log('User created successfully:', response);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  type Field = InputField | SelectField;
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
        name: 'lastName',
        value: formData.lastName,
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
        ],
        onChange: handleRoleChange,
      },
    ];

  const fieldsOrder = ['email', 'password', 'name', 'lastName', 'telephone', 'role'];

  return (
      <BaseForm title="Ajout d'un utilisateur" submitLabel="Ajouter" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="min-w-80" />
  );
}

export default AjoutEleve;