'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';
import { postRequestDropDocument } from '@/api/api';

interface FormData {
  livrable: string;
  file: File | null;
}

interface InputField {
  type: 'input';
  label: string;
  inputType: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type Field = InputField;

function AddDoc() {
  const [formData, setFormData] = useState<FormData>({
    livrable: '',
    file: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({
      ...formData,
      file,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('livrable', formData.livrable);
    if (formData.file) {
      formDataToSend.append('file', formData.file);
    }
  
    try {
      const response = await postRequestDropDocument('dropDocument', formDataToSend);
      console.log('Success:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
    <BaseForm title="Ajouter un Document" submitLabel="Ajouter" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="document" className="block text-sm font-medium text-gray-700">
          Charger un fichier
        </label>
        <input
          type="file"
          id="document"
          name="document"
          accept=".docx,.doc,.odt,.xlsx,.xls,.pdf,.txt,.mdj"
          onChange={handleFileChange}
          className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </BaseForm>
  );

}

export default AddDoc;