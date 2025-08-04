import { Project } from './project.interface';

/**
 * An array of portfolio projects used to populate the Projects section of the app.
 * Each project includes localized text keys, image paths, icon paths, and optional links.
 *
 * @type {Project[]}
 *
 * @property {string} title - i18n translation key for the project title (e.g. `'projects.join.title'`).
 * @property {string} description - i18n translation key for the short description shown in the list view.
 * @property {string} dialogDescription - i18n key for the detailed description shown in the project dialog.
 * @property {string} image - Path to the project preview image (WebP format recommended).
 * @property {string[]} icons - Icon paths for the main list view.
 * @property {string[]} iconsDialoge - Icon paths for the detailed dialog view.
 * @property {string} [github] - Optional GitHub repository link.
 * @property {string} [live] - Optional live deployment link.
 * @property {string} [key] - Optional internal identifier (e.g. `'portfolio'`).
 */
export const PROJECTS: Project[] = [
  {
    title: 'projects.join.title',
    description: 'projects.join.description',
    dialogDescription: 'projects.join.dialogDescription',
    image: 'assets/images/projects_webp/join_image.webp',
    icons: [
      'assets/icons/white/svg/logo_firebase.svg',
      'assets/icons/white/svg/logo_scrum.svg'
    ],
    iconsDialoge: [
      'assets/icons/white/svg/logo_firebase.svg',
      'assets/icons/white/svg/logo_angular.svg',
      'assets/icons/white/svg/logo_typescript.svg',
      'assets/icons/white/svg/logo_html.svg',
      'assets/icons/white/svg/logo_css.svg',
      'assets/icons/white/svg/logo_scrum.svg',
    ],
    github: 'https://github.com/JozArtworks/DA_Join',
    live: 'https://jonathan-michutta.de/join/'
  },
  {
    title: 'projects.pokedex.title',
    description: 'projects.pokedex.description',
    dialogDescription: 'projects.pokedex.dialogDescription',
    image: 'assets/images/projects_webp/pokedex_image.webp',
    icons: [
      'assets/icons/white/svg/logo_api.svg',
    ],
    iconsDialoge: [
      'assets/icons/white/svg/logo_html.svg',
      'assets/icons/white/svg/logo_css.svg',
      'assets/icons/white/svg/logo_javascript.svg',
      'assets/icons/white/svg/logo_api.svg'

    ],
    github: 'https://github.com/JozArtworks/pokedex',
    live: 'https://jonathan-michutta.de/pokedex/'
  },
  {
    title: 'projects.elpollo.title',
    description: 'projects.elpollo.description',
    dialogDescription: 'projects.elpollo.dialogDescription',
    image: 'assets/images/projects_webp/elpolloloco_image.webp',
    icons: [
      'assets/icons/white/svg/logo_oop.svg'
    ],
    iconsDialoge: [
      'assets/icons/white/svg/logo_html.svg',
      'assets/icons/white/svg/logo_css.svg',
      'assets/icons/white/svg/logo_javascript.svg',
      'assets/icons/white/svg/logo_oop.svg',
    ],
    github: 'https://github.com/JozArtworks/ElPolloLoco',
    live: 'https://jonathan-michutta.de/elPolloLoco/'
  },
  {
    key: 'portfolio',
    title: 'projects.portfolio.title',
    description: 'projects.portfolio.description',
    dialogDescription: 'projects.portfolio.dialogDescription',
    image: 'assets/images/projects_webp/portfolio_image.webp',
    icons: [
      'assets/icons/white/svg/logo_angular.svg',
      'assets/icons/white/svg/icon_accessibility.svg',
    ],
    iconsDialoge: [
      'assets/icons/white/svg/logo_angular.svg',
      'assets/icons/white/svg/logo_typescript.svg',
      'assets/icons/white/svg/logo_html.svg',
      'assets/icons/white/svg/logo_css.svg',
      'assets/icons/white/svg/icon_accessibility.svg'
    ],
    github: 'https://github.com/JozArtworks/Portfolio',
  }
];
