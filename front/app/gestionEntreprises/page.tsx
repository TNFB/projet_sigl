'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Home from '@/components/Home';
import BaseMultiAjout from '@/components/BaseMultiAjout'
import { postRequest } from '@/api/api';

const GestionEntreprises = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'apprenticeship_coordinators') {
      router.push('/Login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const [rows, setRows] = useState([{ name: '' }]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, fieldName: string) => {
    const newRows = rows.map((row, i) => 
      i === rowIndex ? { ...row, [fieldName]: e.target.value } : row
    );
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { name: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = '/company/createCompany';
    
    for (const row of rows) {
      if (row.name) {
        try {
          const response = await postRequest(url, JSON.stringify({ name: row.name }));
          console.log('Success:', response);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };

  if (isLoading) {
    return (  
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
          <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
          <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <Home>
        <div className="flex space-x-4 p-4 w-fit">
          <BaseMultiAjout
            title="Ajout d'entreprises"
            typeAjout="Entreprise"
            submitLabel="Ajouter"
            rows={rows}
            onChange={handleChange}
            addRow={addRow}
            onSubmit={handleSubmit}
            className="mx-auto mt-8"
          />
        </div>
    </Home>
  );
}

export default GestionEntreprises