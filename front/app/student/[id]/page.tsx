'use client'
import { useParams  } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Home from '@/components/Home';
import { postRequest } from '@/api/api';

interface Student {
  email: string;
  nom: string;
  prenom: string;
}

export default function StudentInfo() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchStudentInfo = async () => {
        try {
          const response = await postRequest(`apprentice/getInfoApprentice`, JSON.stringify({ data: { id } }));
          console.log(`response:`, response); // Affichez la réponse complète

          if (response) {
            setStudent({
              email: response.email,
              nom: response.name,
              prenom: response.last_name,
            });
          } else {
            setError("Aucun étudiant trouvé");
          }
        } catch (err) {
          console.error(err);
          setError("Erreur lors de la récupération des informations de l'étudiant");
        } finally {
          setLoading(false);
        }
      };
      fetchStudentInfo();
    }
  }, [id]);

  if (loading) return <Home><div>Chargement...</div></Home>;
  if (error) return <Home><div className="text-red-500">Erreur : {error}</div></Home>;
  if (!student) return <Home><div>Aucune information trouvée pour cet étudiant</div></Home>;

  return (
    <Home>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Informations de l'étudiant</h1>
        <div className="bg-white shadow-md rounded-lg p-4">
          <p><strong>Email :</strong> {student.email}</p>
          <p><strong>Nom :</strong> {student.nom}</p>
          <p><strong>Prénom :</strong> {student.prenom}</p>
        </div>
      </div>
    </Home>
  );
}
