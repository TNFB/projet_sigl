'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';

interface FormData {
  livrable: string;
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
    livrable: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
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
}

export default NewLivrable;