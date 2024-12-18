'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';
import { postRequestImportUser } from '@/api/api';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData(e.currentTarget);
  
    // Vérification pour s'assurer qu'un fichier est présent
    const file = formData.get('file') as File | null;
    if (!file) {
      console.error('Aucun fichier sélectionné.');
      return;
    }
  
    if (!file.name.endsWith('.xlsx')) {
      console.error('Le fichier doit être au format .xlsx');
      return;
    }
  
    const url = 'document/importUsers';
    try {
      const response = await postRequestImportUser(url, formData);
      console.log('Success:', response);
    } catch (error) {
      console.error('Error:', error);
    }
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
    <BaseForm title="Création des journaux de formations" submitLabel="Créer" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="h-fit">
      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Charger le fichier
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </BaseForm>
  );
}

export default CreationJF;