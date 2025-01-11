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
import { postRequest } from '@/api/api'

export type User = {
  id: string
  name: string
  email: string
  role: string
  promotion?: string
}

type UserTableProps = {
  typeUser?: string
}

const UserTable: React.FC<UserTableProps> = ({ typeUser }) => {
  const [users, setUsers] = useState<User[]>([])
  const [promotions, setPromotions] = useState<string[]>([])

  // Récupère les utilisateurs à afficher
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = {
          role: typeUser || null,
          detailed: 'true',
        }
        const response = await postRequest(
          'user/getUserEmailsByRole',
          JSON.stringify({ data: data }),
        )
        const formattedUsers = response.users.map((user: any) => ({
          id: user.id_user,
          name: `${user.name} ${user.last_name}`,
          email: user.email,
          role: user.role,
          promotion: user.promotion_name,
        }))
        setUsers(formattedUsers)
        console.log('get USers Emal by Roles successfull:', response)
      } catch (error) {
        console.error('Error fetching emails:', error)
      }
    }

    fetchUsers()
  }, [typeUser])

  // Récupère les promotions pour le champ ajout d un apprenti
  useEffect(() => {
    const fetchPromotions = async () => {
      //const response = await fetch('/api/promotions')
      //const data = await response.json()
      const data = ['Poincarré', 'Einstein', 'Curie', 'Newton']
      setPromotions(data)
    }

    fetchPromotions()
  }, [])

  //Gestion de la popup
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user',
    entreprise: '',
    promotion: '',
  })
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')

  const openEditDialog = (user: User) => {
    setCurrentUser(user)
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
  const handleSaveUser = () => {
    if (currentUser.name && currentUser.email) {
      if (dialogMode === 'add') {
        const newUser: User = {
          id: String(users.length + 1),
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role || 'user',
        }
        setUsers([...users, newUser])
      } else {
        // Edit existing user
        setUsers(
          users.map((user) =>
            user.id === currentUser.id
              ? ({ ...user, ...currentUser } as User)
              : user,
          ),
        )
      }

      setIsDialogOpen(false)
      setCurrentUser({ name: '', email: '', role: 'user' })
    }
  }

  //Gestion des Suppressions
  const handleDeleteUsers = (rowsToDelete: User[]) => {
    setUsers(
      users.filter((user) => !rowsToDelete.some((row) => row.id === user.id)),
    )
  }

  const handleDeleteSingleUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
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
                  handleDeleteSingleUser(user.id)
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
              <Label htmlFor='name' className='text-right'>
                Nom
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
    </div>
  )
}
export default UserTable
