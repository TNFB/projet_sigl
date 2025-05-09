'use client'
import React, { useEffect, useState } from 'react'
import Home from '@/components/Home'
import { postRequest } from '@/api/api'

const Profile = () => {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [competences, setCompetences] = useState<any[]>([])
  const [missions, setMissions] = useState<any[]>([])

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await postRequest('user/getUserInfoByEmail')
        console.log('response:', response.userInfo)
        if (response.redirect) {
          window.location.href = '/Login'
        } else {
          if (response && response.userInfo) {
            setUserInfo(response.userInfo)
            setFormData(response.userInfo)

            // Vérifiez si l'utilisateur est un apprenti
            if (response.userInfo.role === 'apprentices') {
              // Appeler l'API pour récupérer les compétences et missions
              const skillsAndMissionsResponse = await postRequest(
                'apprentice/getMissionAndSkillApprenticeByEmail',
                JSON.stringify({ data: { email: response.userInfo.email } }),
              )

              let parsedMissions = Array.isArray(
                skillsAndMissionsResponse.list_missions,
              )
                ? skillsAndMissionsResponse.list_missions
                : []

              if (typeof skillsAndMissionsResponse.list_missions === 'string') {
                try {
                  parsedMissions = JSON.parse(
                    skillsAndMissionsResponse.list_missions,
                  )
                } catch (parseError) {
                  console.error('Error parsing list_missions:', parseError)
                  parsedMissions = []
                }
              }

              let parsedSkills = Array.isArray(
                skillsAndMissionsResponse.list_skills,
              )
                ? skillsAndMissionsResponse.list_skills
                : []

              if (typeof skillsAndMissionsResponse.list_skills === 'string') {
                try {
                  parsedSkills = JSON.parse(
                    skillsAndMissionsResponse.list_skills,
                  )
                } catch (parseError) {
                  console.error('Error parsing list_skills:', parseError)
                  parsedSkills = []
                }
              }
              console.log(
                `parsedMissions: ${JSON.stringify(parsedMissions, null, 2)}`,
              )
              console.log(
                `parsedSkills: ${JSON.stringify(parsedSkills, null, 2)}`,
              )
              setMissions(parsedMissions)
              setCompetences(parsedSkills)
            }
          } else {
            setError('Aucune information utilisateur trouvée.')
          }
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (name === 'email' && value !== userInfo.email) {
      try {
        const response = await postRequest(
          'user/checkEmailExists',
          JSON.stringify({
            data: { email: value },
          }),
        )
        if (response.redirect) {
          window.location.href = '/Login'
        } else {
          if (response.status === 'success') {
            if (response.exists) {
              setEmailError('Cet email est déjà associé à un compte.')
            } else {
              setEmailError(null)
            }
          } else {
            setEmailError("Erreur lors de la vérification de l'email.")
          }
        }
      } catch (err) {
        console.error(err)
        setEmailError("Erreur lors de la vérification de l'email.")
      }
    }
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    setEmailError(null)
  }

  const handleSaveChanges = async () => {
    if (emailError) return

    try {
      const response = await postRequest(
        'user/updateUser',
        JSON.stringify({ data: formData }),
      )
      if (response.redirect) {
        window.location.href = '/Login'
      } else {
        setUserInfo(response.userInfo)
        localStorage.setItem('token', response.token)
        setIsEditing(false)
      }
    } catch (err) {
      console.error(err)
      setError("Erreur lors de l'enregistrement des modifications.")
    }
  }

  const handleCancelChanges = () => {
    setFormData(userInfo)
    setIsEditing(false)
    setEmailError(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === 'confirmPassword' || name === 'newPassword') {
      if (
        (name === 'confirmPassword' && value !== passwordData.newPassword) ||
        (name === 'newPassword' && value !== passwordData.confirmPassword)
      ) {
        setPasswordError('Les nouveaux mots de passe ne correspondent pas.')
      } else {
        setPasswordError(null)
      }
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas.')
      return
    }

    try {
      const response = await postRequest(
        'user/changePassword',
        JSON.stringify({
          data: {
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          },
        }),
      )
      if (response.redirect) {
        window.location.href = '/Login'
      } else {
        if (response.status === 'success') {
          setIsChangingPassword(false)
          setPasswordData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          })
        } else {
          setPasswordError(
            response.message || 'Erreur lors du changement de mot de passe.',
          )
        }
      }
    } catch (err) {
      console.error(err)
      setPasswordError('Erreur lors du changement de mot de passe.')
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
              {emailError && <p className='text-red-500'>{emailError}</p>}
            </div>
            <div>
              <label>Nom :</label>
              <input
                type='text'
                name='name'
                value={formData.lastName}
                onChange={handleChange}
                className='border p-2 rounded mb-2 w-full'
              />
            </div>
            <div>
              <label>Prénom :</label>
              <input
                type='text'
                name='lastName'
                value={formData.name}
                onChange={handleChange}
                className='border p-2 rounded mb-2 w-full'
              />
            </div>
            <div>
              <label>Téléphone :</label>
              <input
                type='tel'
                name='telephone'
                value={formData.telephone}
                onChange={handleChange}
                className='border p-2 rounded mb-2 w-full'
              />
            </div>
            <button
              onClick={handleSaveChanges}
              className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
              disabled={!!emailError}
            >
              Enregistrer les modifications
            </button>
            <button
              onClick={handleCancelChanges}
              className='bg-gray-500 text-white px-4 py-2 rounded'
            >
              Annuler
            </button>
          </div>
        ) : (
          <div>
            {userInfo ? (
              <>
                <p>
                  <strong>Email :</strong> {userInfo.email}
                </p>
                <p>
                  <strong>Nom :</strong> {userInfo.lastName}
                </p>
                <p>
                  <strong>Prénom :</strong> {userInfo.name}
                </p>
                <p>
                  <strong>Téléphone :</strong> {userInfo.telephone}
                </p>
                <button
                  onClick={handleEditToggle}
                  className='bg-green-500 text-white px-4 py-2 rounded mt-2'
                >
                  Modifier
                </button>
              </>
            ) : (
              <p>Aucune information utilisateur trouvée.</p>
            )}
          </div>
        )}
        <div className='mt-8'>
          <h2 className='text-xl font-bold mb-4'>Changer le mot de passe</h2>
          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit} className='space-y-4'>
              <div>
                <label htmlFor='oldPassword' className='block mb-1'>
                  Ancien mot de passe:
                </label>
                <input
                  type='password'
                  id='oldPassword'
                  name='oldPassword'
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className='border p-2 rounded w-full'
                  required
                />
              </div>
              <div>
                <label htmlFor='newPassword' className='block mb-1'>
                  Nouveau mot de passe:
                </label>
                <input
                  type='password'
                  id='newPassword'
                  name='newPassword'
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className='border p-2 rounded w-full'
                  required
                />
              </div>
              <div>
                <label htmlFor='confirmPassword' className='block mb-1'>
                  Confirmer le nouveau mot de passe:
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className='border p-2 rounded w-full'
                  required
                />
              </div>
              {passwordError && <p className='text-red-500'>{passwordError}</p>}
              <div className='flex space-x-2'>
                <button
                  type='submit'
                  className='bg-blue-500 text-white px-4 py-2 rounded'
                  disabled={
                    !!passwordError ||
                    !passwordData.oldPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                >
                  Changer le mot de passe
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordData({
                      oldPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    })
                    setPasswordError(null)
                  }}
                  className='bg-gray-500 text-white px-4 py-2 rounded'
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsChangingPassword(true)}
              className='bg-green-500 text-white px-4 py-2 rounded'
            >
              Modifier le mot de passe
            </button>
          )}
        </div>
        {userInfo.role === 'apprentices' && (
          <>
            <h2 className='text-xl font-bold mt-4'>Missions</h2>
            {missions.length > 0 ? (
              <table className='min-w-full border-collapse border border-gray-300'>
                <thead>
                  <tr>
                    <th className='border border-gray-300 p-2'>Titre</th>
                    <th className='border border-gray-300 p-2'>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {missions.map((mission) => (
                    <tr key={mission.id}>
                      <td className='border border-gray-300 p-2'>
                        {mission.titre}
                      </td>
                      <td className='border border-gray-300 p-2'>
                        {mission.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune mission trouvée.</p>
            )}
          </>
        )}
      </div>
    </Home>
  )
}

export default Profile
