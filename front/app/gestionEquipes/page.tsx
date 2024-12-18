'use client'
import Home from '@/components/Home'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BaseMultiAjout from '@/components/BaseMultiAjout'
import { postRequest } from '@/api/api'

const GestionEquipes = () => {
  const [rows, setRows] = useState([{ alternant: '', tuteur: '', maitre_apprentissage: '' }]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, fieldName: string) => {
    const newRows = rows.map((row, i) => 
      i === rowIndex ? { ...row, [fieldName]: e.target.value } : row
    );
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { alternant: '', tuteur: '', maitre_apprentissage: '' }]);
  };
    
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = 'ApprenticeshipCoordinator/linkApprentice';
    const formattedData = {
      data: rows.map(row => ({
        apprenticeEmail: row.alternant,
        masterEmail: row.maitre_apprentissage,
        tutorEmail: row.tuteur
      }))
    };
    postRequest(url, JSON.stringify(formattedData))
      .then(response => {
       console.log('Success:', response);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    console.log(formattedData);
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
            title="Ajout de tuteur(s) pédagogique(s)"
            typeAjout="Équipe tutorale n°"
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

export default GestionEquipes