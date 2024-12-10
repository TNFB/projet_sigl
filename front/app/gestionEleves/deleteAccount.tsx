'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';
import { postRequest } from '@/api/api';

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

  const [email] = useState([
    { value: 'email1', label: 'email1@test.com' },
    { value: 'email2', label: 'email2@test.com' },
    { value: 'email3', label: 'email3@test.com' },
  ]);

  const handleUserChange = (value: string) => {
    setFormData({
      ...formData,
      utilisateur: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await postRequest('admin/deleteUser', formData);
      console.log('User deleted successfully:', response);
    } catch (error) {
      console.error('Error delete user:', error);
    }
  };

  type Field = SelectField;
  const fields: Field[] = [
    {
      type: 'select',
      label: 'Email',
      name: 'email',
      value: formData.utilisateur,
      options: email,
      onChange: handleUserChange,
    },
  ];

  const fieldsOrder = ['utilisateur'];

  return (
    <BaseForm title="Suppression d'un utilisateur" submitLabel="Supprimer" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="h-fit" />
  );
}

export default DeleteAccount;