'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';
import { postRequest } from '@/api/api';

interface FormData {
  deposit: string;
}

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

function NewLivrable() {
  const [formData, setFormData] = useState<FormData>({
    deposit: ''
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
    try {
      const response = await postRequest('deposit/addDeposit', formData.deposit);
      console.log('deposit created successfully:', response);
    } catch (error) {
      console.error('Error create deposit:', error);
    }
  };

  type Field = InputField | SelectField;
  const fields: Field[] = [
    {
        type: 'input',
        label: 'Nom du livrable',
        inputType: 'text',
        name: 'livrable',
        value: formData.deposit,
        onChange: handleChange,
      },
  ];

  const fieldsOrder = ['livrable'];

  return (
    <BaseForm title="Ajout d'un nouveau livrable" submitLabel="Ajouter" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="h-fit" />
  );
}

export default NewLivrable;