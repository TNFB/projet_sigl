import React, { useState } from 'react';
import BaseForm from '@/components/BaseForm';

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
  role: string;
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



function AjoutEleve() {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    role: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  type Field = InputField | SelectField;
  const fields: Field[] = [
      {
        type: 'input',
        label: 'Nom',
        inputType: 'text',
        name: 'nom',
        value: formData.nom,
        onChange: handleChange,
      },
      {
        type: 'input',
        label: 'Prénom',
        inputType: 'text',
        name: 'prenom',
        value: formData.prenom,
        onChange: handleChange,
      },
      {
        type: 'input',
        label: 'Email',
        inputType: 'email',
        name: 'email',
        value: formData.email,
        onChange: handleChange,
      },
      {
        type: 'input',
        label: 'Mot de passe',
        inputType: 'password',
        name: 'password',
        value: formData.password,
        onChange: handleChange,
      },
      {
        type: 'input',
        label: 'Téléphone',
        inputType: 'text',
        name: 'telephone',
        value: formData.telephone,
        onChange: handleChange,
      },
      {
        type: 'select',
        label: 'Rôle',
        name: 'role',
        value: formData.role,
        options: [
          { value: 'admin', label: 'Administrateur' },
          { value: 'apprenti', label: 'Apprenti' },
          { value: 'maitre_apprentissage', label: 'Maitre d\'apprentissage' },
          { value: 'tuteur_pedagogique', label: 'Tuteur pédagogique' },
        ],
        onChange: handleRoleChange,
      },
    ];

  const fieldsOrder = ['role', 'nom', 'prenom', 'email', 'telephone', 'password'];

  return (
      <BaseForm title="Ajout d'un utilisateur" submitLabel="Ajouter" onSubmit={handleSubmit} fields={fields} fieldsOrder={fieldsOrder} className="min-w-80" />
  );
}

export default AjoutEleve;