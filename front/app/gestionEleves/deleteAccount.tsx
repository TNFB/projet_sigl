'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';

interface FormData {
  utilisateur: string;
}

interface SelectField {
  type: 'select';
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function DeleteAccount() {
  const [formData, setFormData] = useState<FormData>({
    utilisateur: ''
  });

  const [utilisateurs] = useState([
    { value: 'user1', label: 'User 1' },
    { value: 'user2', label: 'User 2' },
    { value: 'user3', label: 'User 3' },
  ]);

  const handleUserChange = (value: string) => {
    setFormData({
      ...formData,
      utilisateur: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  type Field = SelectField;
  const fields: Field[] = [
    {
      type: 'select',
      label: 'Utilisateur',
      name: 'utilisateur',
      value: formData.utilisateur,
      options: utilisateurs,
      onChange: handleUserChange,
    },
  ];

  const fieldsOrder = ['utilisateur'];

  return (
    <BaseForm title="Suppression d'un utilisateur" submitLabel="Supprimer" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="h-fit" />
  );
}

export default DeleteAccount;