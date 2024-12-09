'use client'
import Home from '@/components/Home'
import React, { useState } from 'react'
import BaseMultiAjout from '@/components/BaseMultiAjout'
import { postRequest } from '@/api/api'

const GestionMaitresApp = () => {
  const fieldsTemplate = [
    {
      type: 'input',
      label: 'Nom',
      inputType: 'text',
      name: 'nom',
    },
    {
      type: 'input',
      label: 'Prénom',
      inputType: 'text',
      name: 'prenom',
    },
    {
      type: 'input',
      label: 'Adresse Email',
      inputType: 'email',
      name: 'email',
    },
  ];

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
    const url = '/apprenticeMaster/addApprenticesApprenticeMaster';
    postRequest(url, JSON.stringify(rows))
      .then(response => {
       console.log('Success:', response);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    console.log(rows);
  };

  return (
    <Home>
        <div className="flex space-x-4 p-4 w-fit">
          <BaseMultiAjout
            title="Ajout de maitres d'apprentissage"
            typeAjout="Maitre d'apprentissage"
            submitLabel="Ajouter"
            fieldsTemplate={fieldsTemplate}
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