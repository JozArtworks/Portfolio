import { Project } from './project.interface';


export const PROJECTS: Project[] = [
  {
    title: 'Join',
    description: 'Task-Manager mit Drag & Drop',
    dialogDescription: 'Task-Manager inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben per Drag & Drop, weise Nutzer und Kategorien zu.',
    image: 'assets/images/join-preview.png',
    icons: [
      'assets/icons/white/svg/logo_firebase.svg',
      'assets/icons/white/svg/logo_scrum.svg'
    ],
    github: 'https://github.com/JozArtworks/DA_Join',
    live: 'https://jonathan-michutta.de/join/'
  },
  {
    title: 'Pokedex',
    description: 'Interaktive App mit API-Daten',
    dialogDescription: 'Interaktive Pokedex-App mit Live-API-Daten. Zeigt Namen, Typen und Bilder - filterbar und durchsuchbar.',
    image: 'assets/images/join-preview.png',
    icons: [
      'assets/icons/white/svg/logo_api.svg',
      'assets/icons/white/svg/logo_typescript.svg'
    ],
    github: 'https://github.com/JozArtworks/pokedex',
    live: 'https://jonathan-michutta.de/pokedex/'
  },
  {
    title: 'El Pollo Loco',
    description: 'Gaming mit OOP',
    dialogDescription: 'Jump-, Run- und Wurfspiel mit objektorientierter Programmiertem Ansatz. Hilf Pepe, Münzen und Tabascosoße zu finden, um gegen das verrückte Huhn zu gewinnen.',
    image: 'assets/images/el-pollo-loco-preview.png',
    icons: [
      'assets/icons/white/svg/logo_keyboard.svg',
      'assets/icons/white/svg/logo_oop.svg'
    ],
    github: 'https://github.com/JozArtworks/ElPolloLoco',
    live: 'https://jonathan-michutta.de/elPolloLoco/'
  },
  {
    title: 'Portfolio',
    description: 'UI-Design & Animation',
    dialogDescription: 'Persönliches Portfolio mit Fokus auf UI-Design und sanften Animationen. Struktur, Stil und Bewegung sorgen für ein klares Nutzererlebnis.',
    image: 'assets/images/portfolio-preview.png',
    icons: [
      'assets/icons/white/svg/logo_angular.svg'
    ],
    github: 'https://github.com/JozArtworks/Portfolio',
    live: 'https://deinprojekt-url.com'
  }
];
