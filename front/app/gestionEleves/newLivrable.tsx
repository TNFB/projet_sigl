'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';
import { postRequest } from '@/api/api';

interface FormData {
  livrable: string;
}

const NewLivrable = () => {
  const [formData, setFormData] = useState<FormData>({
    livrable: '',
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
      value: formData.livrable,
      onChange: handleChange,
    },
  ];

  const fieldsOrder = ['livrable'];

  return (
    <BaseForm title="Ajout d'un nouveau livrable" submitLabel="Ajouter" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="h-fit" />
  );
};

export default NewLivrable;