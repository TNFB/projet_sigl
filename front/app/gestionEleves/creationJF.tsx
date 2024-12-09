'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';

interface FormData {
  promotion: string;
  file: File | null;
}

interface SelectField {
    type: 'select';
    label: string;
    name: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }

type Field = SelectField;

function CreationJF() {
  const [formData, setFormData] = useState<FormData>({
    promotion: '',
    file: null,
  });

  const handlePromotionChange = (value: string) => {
    setFormData({
      ...formData,
      promotion: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({
      ...formData,
      file,
    });
  };

  const [promotions] = useState([
    { value: 'promotion_e3a', label: 'Promotion E3a' },
    { value: 'promotion_e4a', label: 'Promotion E4a' },
    { value: 'promotion_e5a', label: 'Promotion E5a' },
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const fields: Field[] = [
    {
        type: 'select',
        label: 'Promotion :',
        name: 'promotion',
        value: formData.promotion,
        options: promotions,
        onChange: handlePromotionChange,
      },
  ];

  const fieldsOrder = ['promotion'];

  return (
    <BaseForm title="Création des journeaux de formations" submitLabel="Créer" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="h-fit">
      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Charger un fichier
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </BaseForm>
  );
}

export default CreationJF;