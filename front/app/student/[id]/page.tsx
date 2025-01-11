'use client'
import { useParams  } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Home from '@/components/Home';
import { postRequest } from '@/api/api';

interface Student {
  email: string;
  nom: string;
  prenom: string;
  list_missions: Mission[];
}

interface Mission {
  id: number;
  titre: string;
  description: string;
}

function AddMissionModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (mission: Omit<Mission, 'id'>) => void }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ titre, description });
    setTitre('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Ajouter une nouvelle mission</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre de la mission"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la mission"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 rounded">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditMissionModal({ isOpen, onClose, onUpdate, mission }: { isOpen: boolean; onClose: () => void; onUpdate: (mission: Mission) => void; mission: Mission | null }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (mission) {
      setTitre(mission.titre);
      setDescription(mission.description);
    }
  }, [mission]); // Dépendance sur 'mission' pour mettre à jour les champs

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mission) {
      onUpdate({ ...mission, titre, description }); // Mettez à jour la mission avec les nouvelles valeurs
    }
    setTitre('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Modifier la mission</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre de la mission"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la mission"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 rounded">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Modifier</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, missionTitle }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; missionTitle: string | null }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Confirmation de suppression</h3>
        {missionTitle && (
          <p>Êtes-vous sûr de vouloir supprimer la mission : "<strong>{missionTitle}</strong>" ?</p>
        )}
        <div className="flex justify-end mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 rounded">Annuler</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Supprimer</button>
        </div>
      </div>
    </div>
  );
}

export default function StudentInfo() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [missionToEdit, setMissionToEdit] = useState<Mission | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [missionToDeleteId, setMissionToDeleteId] = useState<number | null>(null);
  const [missionToDeleteTitle, setMissionToDeleteTitle] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const userResponse = await postRequest('user/getRole', JSON.stringify({}));
          setUserRole(userResponse.role);
  
          const studentResponse = await postRequest(`apprentice/getInfoApprentice`, JSON.stringify({ data: { id } }));
          if (studentResponse.redirect) {
            window.location.href = '/Login';
            return
          } else {
            // Vérifiez si list_missions est déjà un tableau
            let parsedMissions = Array.isArray(studentResponse.list_missions) 
              ? studentResponse.list_missions 
              : []; // Utilisez un tableau vide si ce n'est pas un tableau

            // Si list_missions est une chaîne, essayez de la parser
            if (typeof studentResponse.list_missions === 'string') {
              try {
                parsedMissions = JSON.parse(studentResponse.list_missions);
              } catch (parseError) {
                console.error('Error parsing list_missions:', parseError);
                // Continuez avec un tableau vide si le parsing échoue
                parsedMissions = [];
              }
            }

            setStudent({
              email: studentResponse.email,
              nom: studentResponse.name,
              prenom: studentResponse.last_name,
              list_missions: parsedMissions
            });
          }
        } catch (err) {
          console.error(err);
          setError("Erreur lors de la récupération des informations");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  const addMission = async (newMission: Omit<Mission, 'id'>) => {
    try {
      const response = await postRequest('apprentice/addMission', JSON.stringify({ data: { id, mission: newMission } }));
      if (response.mission) {
        setStudent(prev => ({
          ...prev!,
          list_missions: [...prev!.list_missions, response.mission],
        }));
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'ajout de la mission");
    }
  };
  
  const updateMission = async (mission: Mission) => {
    try {
      await postRequest('apprentice/updateMission', JSON.stringify({ data: { id, mission } }));
      setStudent(prev => ({
        ...prev!,
        list_missions: prev!.list_missions.map(m => m.id === mission.id ? mission : m),
      }));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour de la mission");
    }
  };

  const handleEditMission = (mission: Mission) => {
    setMissionToEdit(mission);
    setIsEditModalOpen(true);
  };

  const handleUpdateMission = async (updatedMission: Mission) => {
    try {
      await updateMission(updatedMission); // Utilisez votre fonction updateMission ici
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour de la mission");
    }
  };
  
  const deleteMission = async (missionId: number) => {
    try {
      await postRequest('apprentice/deleteMission', JSON.stringify({ data: { id, missionId } }));
      setStudent(prev => ({
        ...prev!,
        list_missions: prev!.list_missions.filter(m => m.id !== missionId),
      }));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de la mission");
    }
  };

  const handleDeleteMission = (mission: Mission) => {
    setMissionToDeleteId(mission.id);
    setMissionToDeleteTitle(mission.titre);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteMission = async () => {
    if (missionToDeleteId !== null) {
      await deleteMission(missionToDeleteId);
      setIsDeleteModalOpen(false);
      setMissionToDeleteId(null);
      setMissionToDeleteTitle(null);
    }
  };

  if (loading) return <Home><div>Chargement...</div></Home>;
  if (error) return <Home><div className="text-red-500">Erreur : {error}</div></Home>;
  if (!student) return <Home><div>Aucune information trouvée pour cet étudiant</div></Home>;

  return (
    <Home>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Informations de l'étudiant</h1>
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <p><strong>Email :</strong> {student.email}</p>
          <p><strong>Nom :</strong> {student.nom}</p>
          <p><strong>Prénom :</strong> {student.prenom}</p>
        </div>
        
        {userRole === 'apprentice_masters' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Missions</h2>
            <table className="w-full mb-4">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {student.list_missions.map(mission => (
                  <tr key={mission.id}>
                    <td>{mission.titre}</td>
                    <td>{mission.description}</td>
                    <td>
                      <button onClick={() => handleEditMission(mission)}> Modifier </button>
                      <button 
                        onClick={() => handleDeleteMission(mission)}
                        className="text-red-500"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded">
              Ajouter une mission
            </button>
            <AddMissionModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAdd={addMission}
            />
            {missionToEdit && (
              <EditMissionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateMission}
                mission={missionToEdit}
              />
            )}
             <ConfirmDeleteModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={confirmDeleteMission}
              missionTitle={missionToDeleteTitle}
            />
          </div>
        )}
      </div>
    </Home>
  );
}
