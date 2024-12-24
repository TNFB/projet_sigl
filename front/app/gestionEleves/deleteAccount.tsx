'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';
import { postRequest } from '@/api/api';

interface FormData {
  email: string;
}

interface InputField {
    type: 'input';
    label: string;
    inputType: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  

function DeleteAccount() {
  const [formData, setFormData] = useState<FormData>({
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formDataJson: { [key: string]: string } = {};
    formDataJson['email'] = formData.email;

    try {
      const data = {
        email: formData.email,
        token: 'token'
      };
      
      postRequest('admin/deleteUser', JSON.stringify({ data: data }))
        .then(response => {
          console.log('User deleted successfully:', response);
          alert('Utilisateur supprimé avec succès');
          //Here can get return opf response 
          // exemple : const { somthing } = response;
        })
      //const response = await postRequest('admin/deleteUser', JSON.stringify(formDataJson));
      //console.log('User deleted successfully:', response);
      //alert('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Error delete user:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  type Field = InputField;
  const fields: Field[] = [
    {
      type: 'input',
      label: 'Email',
      inputType: 'text',
      name: 'email',
      value: formData.email,
      onChange: handleChange,
    },
  ];

  const fieldsOrder = ['email'];

  return (
    <BaseForm title="Supprimer un compte" submitLabel="Supprimer" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="h-fit" />
  );
}

export default DeleteAccount;