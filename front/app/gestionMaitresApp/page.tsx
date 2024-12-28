'use client'
import Home from '@/components/Home'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BaseMultiAjout from '@/components/BaseMultiAjout'
import { postRequest } from '@/api/api'

const GestionMaitresApp = () => {
  const [rows, setRows] = useState([{ nom: '', prenom: '', email: '', entreprise: '' }]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, fieldName: string) => {
    const newRows = rows.map((row, i) => 
      i === rowIndex ? { ...row, [fieldName]: e.target.value } : row
    );
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { nom: '', prenom: '', email: '', entreprise: '' }]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        peopleData: rows.map(row => ({
          name: row.prenom,
          lastName: row.nom,
          email: row.email,
          companyName: row.entreprise
        })),
        token: 'token'
      };
      
      postRequest('apprenticeMaster/createOrUpdateApprenticeMaster', JSON.stringify({ data: data }))
        .then(response => {
          console.log('Success:', response);
          alert('Maître(s) d\'apprentissage ajouté(s) avec succès');
          //Here can get return opf response 
          // exemple : const { somthing } = response;
        })
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de l\'ajout du maître d\'apprentissage');
    }

    /*
    const url = 'apprenticeMaster/createOrUpdateApprenticeMaster';
    const formattedData = {
      data: rows.map(row => ({
        name: row.prenom,
        lastName: row.nom,
        email: row.email,
        companyName: row.entreprise
      }))
    };
    postRequest(url, JSON.stringify(formattedData))
      .then(response => {
       console.log('Success:', response);
        alert('Maître(s) d\'apprentissage ajouté(s) avec succès');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Erreur lors de l\'ajout du maître d\'apprentissage');
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
            title="Ajout de(s) maitre(s) d'apprentissage"
            typeAjout="Maître d'apprentissage n°"
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

export default GestionMaitresApp