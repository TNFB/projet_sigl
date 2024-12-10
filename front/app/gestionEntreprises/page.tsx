'use client'
import Home from '@/components/Home'
import React, { useState } from 'react'
import BaseMultiAjout from '@/components/BaseMultiAjout'

const GestionEntreprises = () => {
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
    console.log(rows);
  };

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