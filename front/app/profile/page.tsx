'use client'
import React, { useEffect, useState } from 'react'
import Home from '@/components/Home'
import { postRequest } from '@/api/api'

const Profile = () => {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false) // État pour gérer le mode d'édition
  const [formData, setFormData] = useState<any>({}) // État pour stocker les données du formulaire

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await postRequest('user/getUserInfoByEmail')
        if (response && response.userInfo) {
          setUserInfo(response.userInfo)
          setFormData(response.userInfo)
        } else {
          setError('Aucune information utilisateur trouvée.')
        }
      } catch (err) {
        console.error(err)
        setError('Erreur lors de la récupération des informations utilisateur.')
      } finally {
        setLoading(false)
      }
    }

    getUserInfo()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveChanges = async () => {
    try {
      // Appeler l'API pour mettre à jour les informations utilisateur
      const response = await postRequest(
        'user/updateUser',
        JSON.stringify({ data: formData }),
      )

      // Mettre à jour userInfo avec toutes les nouvelles données
      setUserInfo(response.userInfo) // Assurez-vous que toutes les données sont présentes ici

      // Mettre à jour le token dans localStorage si nécessaire
      localStorage.setItem('token', response.token) // Remplacez par la clé appropriée

      setIsEditing(false) // Désactiver le mode d'édition après la sauvegarde
    } catch (err) {
      console.error(err)
      setError("Erreur lors de l'enregistrement des modifications.")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <Home>
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>Mon Profil</h1>
        {isEditing ? (
          <div>
            <div>
              <label>Email:</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='border p-2 rounded mb-2'
              />
            </div>
            <div>
              <label>Nom Prénom:</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='border p-2 rounded mb-2'
              />
              <input
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                className='border p-2 rounded mb-2'
              />
            </div>
            <div>
              <label>Téléphone:</label>
              <input
                type='tel'
                name='telephone'
                value={formData.telephone}
                onChange={handleChange}
                className='border p-2 rounded mb-2'
              />
            </div>
            <button
              onClick={handleSaveChanges}
              className='bg-blue-500 text-white px-4 py-2 rounded'
            >
              Enregistrer les modifications
            </button>
          </div>
        ) : (
          <div>
            {userInfo ? (
              <>
                <p>
                  <strong>Email:</strong> {userInfo.email}
                </p>
                <p>
                  <strong>Nom Prénom:</strong> {userInfo.name}{' '}
                  {userInfo.lastName}
                </p>
                <p>
                  <strong>Téléphone:</strong> {userInfo.telephone}
                </p>
                {/* Ajoutez d'autres champs selon les informations disponibles dans userDb */}
                <button
                  onClick={handleEditToggle}
                  className='bg-green-500 text-white px-4 py-2 rounded'
                >
                  Modifier
                </button>
              </>
            ) : (
              <p>Aucune information utilisateur trouvée.</p>
            )}
          </div>
        )}
      </div>
    </Home>
  )
}

export default Profile
