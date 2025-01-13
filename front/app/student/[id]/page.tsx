'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Home from '@/components/Home'
import { postRequest } from '@/api/api'
import { Button } from '@/components/ui/button'

interface Student {
  email: string
  nom: string
  prenom: string
  list_missions: Mission[]
  list_skills: Skill[]
}

interface Mission {
  id: number
  titre: string
  description: string
}

interface Skill {
  id: number
  skill: string
  description: string
}

function AddMissionModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean
  onClose: () => void
  onAdd: (mission: Omit<Mission, 'id'>) => void
}) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ titre, description })
    setTitre('')
    setDescription('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <h3 className='text-lg font-bold mb-4'>Ajouter une nouvelle mission</h3>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder='Titre de la mission'
            className='w-full p-2 mb-4 border rounded'
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description de la mission'
            className='w-full p-2 mb-4 border rounded'
            required
          />
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 mr-2 bg-gray-200 rounded'
            >
              Annuler
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded'
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditMissionModal({
  isOpen,
  onClose,
  onUpdate,
  mission,
}: {
  isOpen: boolean
  onClose: () => void
  onUpdate: (mission: Mission) => void
  mission: Mission | null
}) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (mission) {
      setTitre(mission.titre)
      setDescription(mission.description)
    }
  }, [mission]) // Dépendance sur 'mission' pour mettre à jour les champs

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mission) {
      onUpdate({ ...mission, titre, description }) // Mettez à jour la mission avec les nouvelles valeurs
    }
    setTitre('')
    setDescription('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <h3 className='text-lg font-bold mb-4'>Modifier la mission</h3>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder='Titre de la mission'
            className='w-full p-2 mb-4 border rounded'
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description de la mission'
            className='w-full p-2 mb-4 border rounded'
            required
          />
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 mr-2 bg-gray-200 rounded'
            >
              Annuler
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded'
            >
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  missionTitle,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  missionTitle: string | null
}) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <h3 className='text-lg font-bold mb-4'>Confirmation de suppression</h3>
        {missionTitle && (
          <p>
            Êtes-vous sûr de vouloir supprimer la mission : &quot;
            <strong>{missionTitle}</strong>&quot; ?
          </p>
        )}
        <div className='flex justify-end mt-4'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 mr-2 bg-gray-200 rounded'
          >
            Annuler
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className='px-4 py-2 bg-red-500 text-white rounded'
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

function AddEditSkillModal({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  skill,
}: {
  isOpen: boolean
  onClose: () => void
  onAdd: (skill: Omit<Skill, 'id'>) => void
  onUpdate: (skill: Skill) => void
  skill: Skill | null
}) {
  const [skillName, setSkillName] = useState(skill ? skill.skill : '')
  const [description, setDescription] = useState(skill ? skill.description : '')

  useEffect(() => {
    if (skill) {
      setSkillName(skill.skill)
      setDescription(skill.description)
    }
  }, [skill])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (skill) {
      onUpdate({ ...skill, skill: skillName, description }) // Modifier la compétence existante
    } else {
      onAdd({ skill: skillName, description }) // Ajouter une nouvelle compétence
    }

    setSkillName('')
    setDescription('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <h3 className='text-lg font-bold mb-4'>
          {skill ? 'Modifier la compétence' : 'Ajouter une nouvelle compétence'}
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder='Nom de la compétence'
            className='w-full p-2 mb-4 border rounded'
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description de la compétence'
            className='w-full p-2 mb-4 border rounded'
            required
          />
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 mr-2 bg-gray-200 rounded'
            >
              Annuler
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded'
            >
              {skill ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmDeleteSkillModal({
  isOpen,
  onClose,
  onConfirm,
  skillTitle,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  skillTitle: string | null
}) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <h3 className='text-lg font-bold mb-4'>Confirmation de suppression</h3>
        {skillTitle && (
          <p>
            Êtes-vous sûr de vouloir supprimer la compétence : &quot;
            <strong>{skillTitle}</strong>&quot; ?
          </p>
        )}
        <div className='flex justify-end mt-4'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 mr-2 bg-gray-200 rounded'
          >
            Annuler
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className='px-4 py-2 bg-red-500 text-white rounded'
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StudentInfo() {
  const { id } = useParams()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [missionToEdit, setMissionToEdit] = useState<Mission | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [missionToDeleteId, setMissionToDeleteId] = useState<number | null>(
    null,
  )
  const [missionToDeleteTitle, setMissionToDeleteTitle] = useState<
    string | null
  >(null)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null)
  const [isDeleteSkillModalOpen, setIsDeleteSkillModalOpen] = useState(false)
  const [skillToDeleteId, setSkillToDeleteId] = useState<number | null>(null)
  const [skillToDeleteTitle, setSkillToDeleteTitle] = useState<string | null>(
    null,
  )

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const userResponse = await postRequest(
            'user/getRole',
            JSON.stringify({}),
          )
          setUserRole(userResponse.role)

          const studentResponse = await postRequest(
            `apprentice/getInfoApprentice`,
            JSON.stringify({ data: { id } }),
          )
          if (studentResponse.redirect) {
            window.location.href = '/Login'
            return
          } else {
            let parsedMissions = Array.isArray(studentResponse.list_missions)
              ? studentResponse.list_missions
              : []

            if (typeof studentResponse.list_missions === 'string') {
              try {
                parsedMissions = JSON.parse(studentResponse.list_missions)
              } catch (parseError) {
                console.error('Error parsing list_missions:', parseError)
                parsedMissions = []
              }
            }

            let parsedSkills = Array.isArray(studentResponse.list_skills)
              ? studentResponse.list_skills
              : []

            if (typeof studentResponse.list_skills === 'string') {
              try {
                parsedSkills = JSON.parse(studentResponse.list_skills)
              } catch (parseError) {
                console.error('Error parsing list_skills:', parseError)
                parsedSkills = []
              }
            }

            setStudent({
              email: studentResponse.email,
              nom: studentResponse.name,
              prenom: studentResponse.last_name,
              list_missions: parsedMissions,
              list_skills: parsedSkills,
            })
          }
        } catch (err) {
          console.error(err)
          setError('Erreur lors de la récupération des informations')
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [id])

  const addMission = async (newMission: Omit<Mission, 'id'>) => {
    try {
      const response = await postRequest(
        'apprentice/addMission',
        JSON.stringify({ data: { id, mission: newMission } }),
      )
      if (response.mission) {
        setStudent((prev) => ({
          ...prev!,
          list_missions: [...prev!.list_missions, response.mission],
        }))
      }
    } catch (err) {
      console.error(err)
      setError("Erreur lors de l'ajout de la mission")
    }
  }

  const updateMission = async (mission: Mission) => {
    try {
      await postRequest(
        'apprentice/updateMission',
        JSON.stringify({ data: { id, mission } }),
      )
      setStudent((prev) => ({
        ...prev!,
        list_missions: prev!.list_missions.map((m) =>
          m.id === mission.id ? mission : m,
        ),
      }))
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la mise à jour de la mission')
    }
  }

  const handleEditMission = (mission: Mission) => {
    setMissionToEdit(mission)
    setIsEditModalOpen(true)
  }

  const handleUpdateMission = async (updatedMission: Mission) => {
    try {
      await updateMission(updatedMission)
      setIsEditModalOpen(false)
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la mise à jour de la mission')
    }
  }

  const deleteMission = async (missionId: number) => {
    try {
      await postRequest(
        'apprentice/deleteMission',
        JSON.stringify({ data: { id, missionId } }),
      )
      setStudent((prev) => ({
        ...prev!,
        list_missions: prev!.list_missions.filter((m) => m.id !== missionId),
      }))
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la suppression de la mission')
    }
  }

  const handleDeleteMission = (mission: Mission) => {
    setMissionToDeleteId(mission.id)
    setMissionToDeleteTitle(mission.titre)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteMission = async () => {
    if (missionToDeleteId !== null) {
      await deleteMission(missionToDeleteId)
      setIsDeleteModalOpen(false)
      setMissionToDeleteId(null)
      setMissionToDeleteTitle(null)
    }
  }

  const addSkill = async (newSkill: Omit<Skill, 'id'>) => {
    try {
      const response = await postRequest(
        'apprentice/addSkill',
        JSON.stringify({ data: { id, skill: newSkill } }),
      )
      if (response.skill) {
        setStudent((prev) => ({
          ...prev!,
          list_skills: [...prev!.list_skills, response.skill],
        }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const updateSkill = async (skill: Skill) => {
    try {
      const response = await postRequest(
        'apprentice/updateSkill',
        JSON.stringify({ data: { id, skill } }),
      )
      setStudent((prev) => ({
        ...prev!,
        list_skills: prev!.list_skills.map((m) =>
          m.id === skill.id ? skill : m,
        ),
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditSkill = (skill: Skill) => {
    setSkillToEdit(skill)
    setIsSkillModalOpen(true)
  }

  const handleUpdateSkill = async (updatedSkill: Skill) => {
    try {
      await updateSkill(updatedSkill)
      setIsSkillModalOpen(false)
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la mise à jour de la compétance')
    }
  }

  const handleDeleteSkill = (skill: Skill) => {
    setSkillToDeleteId(skill.id)
    setSkillToDeleteTitle(skill.skill)
    setIsDeleteSkillModalOpen(true)
  }

  const confirmDeleteSkill = async () => {
    if (skillToDeleteId !== null) {
      await deleteSkill(skillToDeleteId)
      setIsDeleteSkillModalOpen(false)
      setSkillToDeleteId(null)
      setSkillToDeleteTitle(null)
    }
  }

  const deleteSkill = async (skillId: number) => {
    try {
      await postRequest(
        'apprentice/deleteSkill',
        JSON.stringify({ data: { id, skillId } }),
      )
      setStudent((prev) => ({
        ...prev!,
        list_skills: prev!.list_skills.filter((m) => m.id !== skillId),
      }))
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la suppression de la mission')
    }
  }

  if (loading)
    return (
      <Home>
        <div>Chargement...</div>
      </Home>
    )
  if (error)
    return (
      <Home>
        <div className='text-red-500'>Erreur : {error}</div>
      </Home>
    )
  if (!student)
    return (
      <Home>
        <div>Aucune information trouvée pour cet étudiant</div>
      </Home>
    )

  return (
    <Home>
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>
          Informations de l&apos;étudiant
        </h1>
        <div className='bg-white shadow-md rounded-lg p-4 mb-4 w-fit'>
          <p>
            <strong>Email :</strong> {student.email}
          </p>
          <p>
            <strong>Nom :</strong> {student.prenom}
          </p>
          <p>
            <strong>Prénom :</strong> {student.nom}
          </p>
        </div>

        {userRole === 'apprentice_masters' && (
          <div>
            <h2 className='text-xl font-bold mb-2'>Missions</h2>
            <table className='w-full mb-4'>
              <div className='grid grid-cols-3 gap-4 mb-2 font-bold'>
                <span className='col-span-1'>Titre</span>
                <span className='col-span-1'>Description</span>
                <span className='col-span-1 text-right pr-24'>Actions</span>
              </div>
              <tbody>
                {student.list_missions.map((mission) => (
                  <tr
                    key={mission.id}
                    className='w-full grid grid-cols-3 gap-4 items-center bg-white p-4 rounded shadow mb-2'
                  >
                    <td>{mission.titre}</td>
                    <td>{mission.description}</td>
                    <td className='text-right'>
                      <Button
                        onClick={() => handleEditMission(mission)}
                        className='mr-2 bg-green-500'
                      >
                        Modifier
                      </Button>
                      <Button
                        variant='destructive'
                        onClick={() => handleDeleteMission(mission)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setIsModalOpen(true)}
              className='px-4 py-2 bg-green-500 text-white rounded'
            >
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
  )
}
