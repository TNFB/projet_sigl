'use client'
import React from 'react';
import Home from '@/components/Home';
import AjoutEleve from './ajoutEleve';
import ModifMDP from './modifMDP';
import DeleteAccount from './deleteAccount';
import NewLivrable from './newLivrable';
import AddDoc from './addDoc';

function GestionEleves() {
  return (
    <Home>
      <div className="flex space-x-4 p-4 w-fit">
        <AjoutEleve />
        <div className="flex flex-col space-y-5">
          <ModifMDP />
          <DeleteAccount />
        </div>
        <div className="flex flex-col space-y-2">
          <NewLivrable />
          <AddDoc />
        </div>
      </div>
    </Home>
  );
}

export default GestionEleves;