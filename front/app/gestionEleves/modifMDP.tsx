'use client'
import React, { useState } from 'react'
import BaseForm from '@/components/BaseForm'
import { postRequest } from '@/api/api'

interface FormData {
  user: string;
  password: string;
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

function ModifMDP() {
  const [formData, setFormData] = useState<FormData>({
    user: '',
    password: '',
  });

  const [email] = useState([
    { value: 'email1', label: 'email1@test.com' },
    { value: 'email2', label: 'email2@test.com' },
    { value: 'email3', label: 'email3@test.com' },
  ]);

  const [showPassword, setShowPassword] = useState(false);

  const handleUserChange = (value: string) => {
    setFormData({
      ...formData,
      user: value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      password: e.target.value,
    });
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      password,
    });
  };

  // Here
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postRequest('admin/overritePassword', JSON.stringify({ email: formData.email, newPassword: formData.password }))
      .then(response => {
       console.log('Success:', response);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  type Field = InputField | SelectField;
  const fields: Field[] = [
    {
      type: 'select',
      label: 'Email',
      name: 'email',
      value: formData.email,
      options: email,
      onChange: handleUserChange,
    },
  ];

  const fieldsOrder = ['utilisateur'];

  return (
    <BaseForm title="Modification MDP utilisateur" submitLabel="Modifier" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="h-fit">
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        <div className="flex">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handlePasswordChange}
            className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={generatePassword}
            className="ml-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span role="img" aria-label="generate">🔄</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span role="img" aria-label="show-password">{showPassword ? '🙈' : '👁️'}</span>
          </button>
        </div>
      </div>
    </BaseForm>
  );
}

export default ModifMDP;