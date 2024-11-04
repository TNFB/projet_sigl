
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Home, CheckSquare, FileText, BookOpen, Clipboard, UsersRound } from "lucide-react"

export const SIDEBAR_ITEMS = [
    {
      title: "Accueil",
      url: "/accueil",
      icon: "Home",
    },
    {
      title: "Mes tâches",
      url: "/taches",
      icon: "CheckSquare",
    },
    {
      title: "Notes",
      url: "/notes",
      icon: "FileText",
    },
    {
      title: "Documents",
      url: "/documents",
      icon: "BookOpen",
    },
    {
      title: "Évaluations",
      url: "/evaluations",
      icon: "Clipboard",
    },
]


export const SIDEBAR_ADMIN_ITEMS = [
  {
    title: "Accueil",
    url: "/accueil",
    icon: "Home",
  },
  {
    title: "Gestion des élèves",
    url: "/taches",
    icon: "UsersRound",
  },
  {
    title: "Gestion des livrables",
    url: "/documents",
    icon: "BookOpen",
  },
]
  