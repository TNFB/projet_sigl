'use client'
import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2, Edit, Eye } from 'lucide-react'
import { DataTable } from '@/components/table/data-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { postRequest, postRequestCreateUser } from '@/api/api'
import ProgressPopup from '@/components/ProgressPopup'
import { set } from 'date-fns'

export type User = {
  id: string
  name: string
  last_name: string
  email: string
  role: string
  entreprise?: string
  promotion?: string
  telephone?: string
}

type ErrorResponse = {
  response?: {
    status: number
    data?: any
  }
  message?: string
}

type UserTableProps = {
  usersData: User[]
  onUserDelete: (userId: string) => void
}

const UserTable: React.FC<UserTableProps> = ({ usersData, onUserDelete }) => {
  const [users, setUsers] = useState<User[]>([])
  const [promotions, setPromotions] = useState<string[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popupStatus, setPopupStatus] = useState<
    'creating' | 'success' | 'error'
  >('creating')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [progressMessage, setProgressMessage] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  // Récupère les promotions pour le champ ajout d un apprenti
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await postRequest('cursus/promotions')
        const promotions = response.promotions.map(
          (promotion: any) => promotion.promotion_name,
        )
        setPromotions(promotions)
      } catch (error) {
        console.error('Error fetching promotions:', error)
      }
    }
    setUsers(usersData)
    fetchPromotions()
  }, [usersData])

  //Gestion de la popup
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    name: '',
    last_name: '',
    email: '',
    role: '',
    entreprise: '',
    promotion: '',
    telephone: '',
  })
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')

  const openEditDialog = (user: User) => {
    const [firstName, ...lastNameParts] = user.name.split(' ')
    const last_name = lastNameParts.join(' ')
    setCurrentUser({ ...user, name: firstName, last_name: last_name })
    console.log('currentUser', currentUser.last_name)
    setDialogMode('edit')
    setIsDialogOpen(true)
  }

  //Gestion des couleurs des rôles
  const getRoleClass = (role: string) => {
    switch (role) {
      case 'admins':
        return 'bg-red-500 text-white'
      case 'apprentice_masters':
        return 'bg-green-500 text-white'
      case 'educational_tutors':
        return 'bg-blue-500 text-white'
      case 'apprentices':
        return 'bg-yellow-500 text-white'
      case 'professionals':
        return 'bg-pink-500 text-white'
      case 'teachers':
        return 'bg-teal-500 text-white'
      default:
        return ''
    }
  }

  //Gestion de l'ajout et de la modification
  const handleSaveUser = async () => {
    const { name, last_name, email, role, entreprise, promotion, telephone } =
      currentUser
    console.log('currentUser', currentUser)
    setIsPopupOpen(true)
    setProgressMessage('Création en cours...')
    setPopupStatus('creating')

    if (name && email) {
      try {
        const data = {
          email: email || '',
          name: name || '',
          last_name: last_name || '',
          role: role || 'user',
          company: entreprise || '',
          promotion: promotion || '',
          telephone: telephone || '',
        }
        console.log('data', data)

        let response
        if (dialogMode === 'add') {
          response = await postRequestCreateUser('user/createUser', data)
          setSuccessMessage('Utilisateur créé avec succès')
        } else {
          response = await postRequest(
            'user/updateUser',
            JSON.stringify({ data: data }),
          )
          setSuccessMessage('Utilisateur modifié avec succès')
        }
        setPopupStatus('success')

        setTimeout(() => {
          setIsDialogOpen(false)
          setIsPopupOpen(false)
          setCurrentUser({
            name: '',
            last_name: '',
            email: '',
            role: '',
            entreprise: '',
            promotion: '',
          })
          window.location.reload()
        }, 2000)
      } catch (error) {
        console.error('Error creating user:', error)
        setErrorMessage("Erreur lors de la création de l'utilisateur")
        setPopupStatus('error')
        setTimeout(() => {
          setIsPopupOpen(false)
        }, 2000)
      }
    }
  }

  //Gestion des Suppressions
  const handleDeleteUsers = async (rowsToDelete: User[]) => {
    setIsPopupOpen(true)
    setProgressMessage('Suppression en cours...')
    setPopupStatus('creating')
    await Promise.all(
      rowsToDelete.map(async (row) => {
        try {
          const data = {
            email: row.email,
          }
          const response = await postRequest(
            'admin/deleteUser',
            JSON.stringify({ data: data }),
          )
          setSuccessMessage('Utilisateurs supprimés avec succès')
          onUserDelete(row.email)
          setPopupStatus('success')
        } catch (error) {
          console.error('Error deleting user:', error)
          setErrorMessage('Erreur lors de suppression des utilisateurs')
          setPopupStatus('error')
          setTimeout(() => {
            setIsPopupOpen(false)
          }, 2000)
        }
      }),
    )
    setTimeout(() => {
      setIsPopupOpen(false)
      setUsers(
        users.filter((user) => !rowsToDelete.some((row) => row.id === user.id)),
      )
    }, 2000)
  }

  const handleDeleteSingleUser = (userEmail: string) => {
    setIsPopupOpen(true)
    setProgressMessage('Suppression en cours...')
    setPopupStatus('creating')
    try {
      const data = {
        email: userEmail,
      }
      postRequest('admin/deleteUser', JSON.stringify({ data: data })).then(
        (response) => {
          setSuccessMessage('Utilisateur supprimé avec succès')
          setPopupStatus('success')
        },
      )
    } catch (error) {
      console.error('Error delete user:', error)
      setErrorMessage("Erreur lors de la suppression de l'utilisateur")
      setPopupStatus('error')
      setTimeout(() => {
        setIsPopupOpen(false)
      }, 2000)
    }
    setTimeout(() => {
      setIsPopupOpen(false)
      onUserDelete(userEmail)
      setUsers(users.filter((user) => user.email !== userEmail))
    }, 2000)
  }

  const handleResetPassword = async () => {
    setIsPopupOpen(true)
    setProgressMessage('Rénitialisation en cours...')
    setPopupStatus('creating')
    console.log('currentUser', currentUser.email)
    try {
      const data = {
        email: currentUser.email,
      }

      const response = await postRequest(
        'admin/overritePassword',
        JSON.stringify({ data: data }),
      )

      if (response.status === 422) {
        setErrorMessage('Le mot de passe ne peut pas être le même')
        setPopupStatus('error')
      } else {
        console.log('OverritePassword successful:', response)
        setSuccessMessage('Mot de passe réinitialisé avec succès')
        setPopupStatus('success')

        setTimeout(() => {
          setIsPopupOpen(false)
        }, 2000)
      }
    } catch (error: unknown) {
      const errorResponse = error as ErrorResponse
      if (errorResponse.response && errorResponse.response.status === 422) {
        setErrorMessage('Le mot de passe ne peut pas être le même')
      } else {
        setErrorMessage('Erreur lors de la modification du mot de passe')
      }
      setPopupStatus('error')
    }

    setTimeout(() => {
      setIsPopupOpen(false)
    }, 2000)
  }

  //Gestion des colonnes et actions
  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className='lowercase'>{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role')
        return (
          <Badge className={`${getRoleClass(row.original.role)} no-hover`}>
            {role as string}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'promotion',
      header: 'Promotion',
      cell: ({ row }) => (
        <div className='lowercase'>{row.getValue('promotion')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Ouvrir le menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Eye className='mr-2 h-4 w-4' /> Vue
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <p>Nom: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  openEditDialog(user)
                }}
              >
                <Edit className='mr-2 h-4 w-4' /> Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  handleDeleteSingleUser(user.email)
                }}
              >
                <Trash2 className='mr-2 h-4 w-4' /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add'
                ? 'Ajouter un utilisateur'
                : 'Modifier un utilisateur'}
            </DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='last_name' className='text-right'>
                Nom
              </Label>
              <Input
                id='last_name'
                value={currentUser.last_name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, last_name: e.target.value })
                }
                className='col-span-3 border border-gray-300 text-black placeholder-gray-500 rounded-sm focus:border-gray-300 selection:bg-gray-300 selection:text-black'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Prénom
              </Label>
              <Input
                id='name'
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
                className='col-span-3 border border-gray-300 text-black placeholder-gray-500 rounded-sm focus:border-gray-300'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <Input
                id='email'
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
                className='col-span-3 border border-gray-300 text-black placeholder-gray-500 rounded-sm focus:border-gray-300'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Téléphone
              </Label>
              <Input
                id='telephone'
                value={currentUser.telephone}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, telephone: e.target.value })
                }
                className='col-span-3 border border-gray-300 text-black placeholder-gray-500 rounded-sm focus:border-gray-300'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='role' className='text-right'>
                Role
              </Label>
              <Select
                value={currentUser.role}
                onValueChange={(value) =>
                  setCurrentUser({
                    ...currentUser,
                    role: value as
                      | 'admins'
                      | 'apprentice_masters'
                      | 'educational_tutors'
                      | 'apprentices'
                      | 'professionals'
                      | 'teachers',
                  })
                }
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Role' />
                </SelectTrigger>
                <SelectContent id='role'>
                  <SelectItem value='admins'>Administrateur</SelectItem>
                  <SelectItem value='apprentice_masters'>
                    Maître d&apos;apprentissage
                  </SelectItem>
                  <SelectItem value='educational_tutors'>
                    Tuteur pédagogique
                  </SelectItem>
                  <SelectItem value='apprentices'>Apprenti</SelectItem>
                  <SelectItem value='professionals'>Professionnel</SelectItem>
                  <SelectItem value='teachers'>Professeur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {currentUser.role === 'apprentices' && (
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='promotion' className='text-right'>
                Promotion
              </Label>
              <Select
                value={currentUser.promotion}
                onValueChange={(value) =>
                  setCurrentUser({ ...currentUser, promotion: value })
                }
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Promotion' />
                </SelectTrigger>
                <SelectContent id='promotion'>
                  {promotions.map((promotion) => (
                    <SelectItem key={promotion} value={promotion}>
                      {promotion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {(currentUser.role === 'apprentice_masters' ||
            currentUser.role === 'professionals') && (
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='entreprise' className='text-right'>
                Entreprise
              </Label>
              <Input
                id='entreprise'
                value={currentUser.entreprise}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, entreprise: e.target.value })
                }
                className='col-span-3 border border-gray-300 text-black placeholder-gray-500 rounded-sm focus:border-gray-300'
              />
            </div>
          )}
          {dialogMode === 'edit' && (
            <div className='flex justify-center mt-4'>
              <Button
                onClick={handleResetPassword}
                className='bg-red-500 hover:bg-red-600'
              >
                Réinitialiser le mot de passe
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button
              type='submit'
              onClick={handleSaveUser}
              className='bg-green-500'
            >
              {dialogMode === 'add' ? 'Ajouter' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={users}
        onAdd={() => {
          setCurrentUser({ name: '', email: '', role: 'user' })
          setDialogMode('add')
          setIsDialogOpen(true)
        }}
        onDelete={handleDeleteUsers}
      />
      <ProgressPopup
        isOpen={isPopupOpen}
        status={popupStatus}
        creatingMessage={progressMessage}
        successMessage={successMessage}
        errorMessage={errorMessage}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  )
}
export default UserTable
