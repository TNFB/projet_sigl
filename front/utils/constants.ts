import {
  Home,
  CheckSquare,
  FileText,
  BookOpen,
  Clipboard,
  UsersRound,
} from 'lucide-react'

export const SIDEBAR_ITEMS = [
  {
    label: 'Accueil',
    href: '/',
    icon: 'Home',
  },
  {
    label: 'Mes tâches',
    href: '/taches',
    icon: 'CheckSquare',
  },
  {
    label: 'Notes',
    href: '/blocNote',
    icon: 'FileText',
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: 'BookOpen',
  },
  {
    label: 'Évaluations',
    href: '/evaluations',
    icon: 'Clipboard',
  },
]

export const SIDEBAR_ADMIN_ITEMS = [
  {
    label: 'Gestion des utilisateurs',
    href: '/gestionUsers',
    icon: 'UsersRound',
  },
  {
    label: 'Gestion des documents',
    href: '/gestionEleves',
    icon: 'FileText',
  },
]
