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
    const token = localStorage.getItem('token');
    if ( !token && role !== 'admins') {
      localStorage.clear();
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
    try {
      const data = {
        companiesData: rows.map(row => ({ name: row.name })),
        token: 'token'
      };
      
      postRequest('company/createCompany', JSON.stringify({ data: data }))
        .then(response => {
          console.log('Success:', response);
          alert('Entreprise(s) ajoutée(s) avec succès');
          //Here can get return opf response 
          // exemple : const { somthing } = response;
        })
      } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de l\'ajout de l\'entreprise');
      }
    /*
    const url = 'company/createCompany';
    const formattedData = {
      data: rows.map(row => ({
        name: row.name,
      }))
    };
    postRequest(url, JSON.stringify(formattedData))
        .then(response => {
        console.log('Success:', response);
        alert('Entreprise(s) ajoutée(s) avec succès');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Erreur lors de l\'ajout de l\'entreprise');
      });
      */
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
            title="Ajout d'entreprise(s)"
            typeAjout="Entreprise n°"
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