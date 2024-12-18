'use client'
import Home from '@/components/Home'
import React, { useState } from 'react'
import BaseMultiAjout from '@/components/BaseMultiAjout'
import { postRequest } from '@/api/api'

const GestionTuteurs = () => {
  const [rows, setRows] = useState([{ nom: '', prenom: '', email: '' }]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, fieldName: string) => {
    const newRows = rows.map((row, i) => 
      i === rowIndex ? { ...row, [fieldName]: e.target.value } : row
    );
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { nom: '', prenom: '', email: '' }]);
  };
    
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = 'educationalTutor/createOrUpdateEducationalTutor';
    const formattedData = {
      data: rows.map(row => ({
        name: row.prenom,
        lastName: row.nom,
        email: row.email
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
  
  return (
    <Home>
        <div className="flex space-x-4 p-4 w-fit">
          <BaseMultiAjout
            title="Ajout de tuteurs pédagogiques"
            typeAjout="Tuteur pédagogique"
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

export default GestionTuteurs