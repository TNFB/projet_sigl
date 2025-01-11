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
    label: 'Accueil',
    href: '/',
    icon: 'Home',
  },
  {
    label: 'Gestion des utilisateurs',
    href: '/gestionUsers',
    icon: 'UsersRound',
  },
  {
    label: 'Gestion des élèves',
    href: '/gestionEleves',
    icon: 'UsersRound',
  },
  {
    label: 'Gestion des livrables',
    href: '/',
    icon: 'BookOpen',
  },
  {
    label: "Maîtres d'apprentissage",
    href: '/gestionMaitresApp',
    icon: 'UsersRound',
  },
  {
    label: 'Tuteurs pédagogiques',
    href: '/gestionTuteurs',
    icon: 'UsersRound',
  },
  {
    label: 'Intervenants extérieurs',
    href: '/gestionIntervenants',
    icon: 'UsersRound',
  },
  {
    label: 'Entreprises partenaires',
    href: '/gestionEntreprises',
    icon: 'UsersRound',
  },
  {
    label: 'Équipes tutorales',
    href: '/gestionEquipes',
    icon: 'UsersRound',
  },
]
