'use client'
import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';
import { postRequest } from '@/api/api';


function DeleteAccount() {
  
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('email', email);

    const formDataJson: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      formDataJson[key] = value;
    });

    try {
      const response = await postRequest('admin/deleteUser', JSON.stringify(formDataJson));
      console.log('User deleted successfully:', response);
    } catch (error) {
      console.error('Error delete user:', error);
    }
  };

  const fields = [
    {
      type: 'email',
      label: 'Email',
      name: 'email',
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), // Mise à jour de l'email
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md"
      >
        Supprimer
      </button>
    </form>
  );
}

export default DeleteAccount;