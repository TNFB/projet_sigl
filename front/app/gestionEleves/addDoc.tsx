'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';
import { postRequestImportUser } from '@/api/api';

interface FormData {
  email: string;
  documentName: string;
  document: File | null;
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
    email: 'admin@test.com',
    documentName: '',
    document: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const document = e.target.files ? e.target.files[0] : null;
    setFormData({
      ...formData,
      document,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('documentName', formData.documentName);
    if (formData.document) {
      formDataToSend.append('document', formData.document);
    }

    const url = 'document/dropDocument';
    try {
      const response = await postRequestImportUser(url, formDataToSend);
      console.log('Success:', response);
      alert('Document ajouté avec succès');
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de l\'ajout du document');
    }
  };

  const fields: Field[] = [
    {
      type: 'input',
      label: 'Nom du document',
      inputType: 'text',
      name: 'documentName',
      value: formData.documentName,
      onChange: handleChange,
    },
  ];

  const fieldsOrder = ['documentName'];

  return (
    <BaseForm title="Ajouter un document" submitLabel="Ajouter" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="document" className="block text-sm font-medium text-gray-700">
          Charger un fichier
        </label>
        <input
          type="file"
          id="document"
          name="document"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </BaseForm>
  );

}

export default AddDoc;