/**
 * Represents a single tool icon used in the portfolio.
 * Displayed on the landing page under "Tools & Skills".
 */
export interface ToolIcon {
  /**
   * Internal name of the tool (used for identification, not shown in UI).
   */
  name: string;

  /**
   * Translation key for the `alt` attribute (accessibility and screenreader).
   */
  alt: string;

  /**
   * Path to the icon image (usually an SVG in the assets folder).
   */
  icon: string;
}

/**
 * Core development tools and technologies.
 * Shown in the main skills section on the landing page.
 */
export const toolsIcons: ToolIcon[] = [
  {
    name: 'Api',
    alt: 'tools-alt-landing.api.alt',
    icon: 'assets/icons/white/svg/logo_api.svg'
  },
  {
    name: 'JavaScript',
    alt: 'tools-alt-landing.javascript.alt',
    icon: 'assets/icons/white/svg/logo_javascript.svg'
  },
  {
    name: 'HTML',
    alt: 'tools-alt-landing.html.alt',
    icon: 'assets/icons/white/svg/logo_html.svg'
  },
  {
    name: 'Git',
    alt: 'tools-alt-landing.git.alt',
    icon: 'assets/icons/white/svg/logo_git.svg'
  },
  {
    name: 'Scrum',
    alt: 'tools-alt-landing.scrum.alt',
    icon: 'assets/icons/white/svg/logo_scrum.svg'
  },
  {
    name: 'CSS',
    alt: 'tools-alt-landing.css.alt',
    icon: 'assets/icons/white/svg/logo_css.svg'
  },
  {
    name: 'TypeScript',
    alt: 'tools-alt-landing.typescript.alt',
    icon: 'assets/icons/white/svg/logo_typescript.svg'
  },
  {
    name: 'Firebase',
    alt: 'tools-alt-landing.firebase.alt',
    icon: 'assets/icons/white/svg/logo_firebase.svg'
  },
  {
    name: 'Angular',
    alt: 'tools-alt-landing.angular.alt',
    icon: 'assets/icons/white/svg/logo_angular.svg'
  },
  {
    name: 'Material',
    alt: 'tools-alt-landing.material.alt',
    icon: 'assets/icons/white/svg/logo_material.svg'
  },
  {
    name: 'school',
    alt: 'tools-alt-landing.school.alt',
    icon: 'assets/icons/white/svg/logo_learn.svg'
  },
  {
    name: 'OOP',
    alt: 'tools-alt-landing.oop.alt',
    icon: 'assets/icons/white/svg/logo_oop.svg'
  },
  {
    name: 'accessibility',
    alt: 'tools-alt-landing.access.alt',
    icon: 'assets/icons/white/svg/icon_accessibility.svg'
  },
];

/**
 * Additional tools and frameworks not part of the main stack.
 * Currently hidden or placed in optional areas of the UI.
 */
export const extraTools: ToolIcon[] = [
  {
    name: 'React',
    alt: 'tools-alt-landing.react.alt',
    icon: 'assets/icons/white/svg/logo_react.svg',
  },
  {
    name: 'Vue Js',
    alt: 'tools-alt-landing.vue.alt',
    icon: 'assets/icons/white/svg/logo_vue.svg',
  },
];

/**
 * Design-related tools shown in a separate section of the landing page.
 */
export const toolsIconsDesign: ToolIcon[] = [
  {
    name: 'Figma',
    alt: 'tools-alt-landing.figma.alt',
    icon: 'assets/icons/white/svg/logo_figma.svg',
  },
  {
    name: 'Photoshop',
    alt: 'tools-alt-landing.photoshop.alt',
    icon: 'assets/icons/white/svg/logo_photoshop.svg',
  },
  {
    name: 'Illustrator',
    alt: 'tools-alt-landing.illustrator.alt',
    icon: 'assets/icons/white/svg/logo_illustrator.svg',
  },
  {
    name: 'InDesign',
    alt: 'tools-alt-landing.indesign.alt',
    icon: 'assets/icons/white/svg/logo_indesign.svg',
  },
];
