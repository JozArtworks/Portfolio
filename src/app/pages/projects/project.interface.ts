/**
 * Interface representing a portfolio project entry.
 * Used in the Projects section to define content, links, and visuals.
 */
export interface Project {
  /**
   * i18n translation key for the project title (e.g. 'projects.join.title').
   */
  title: string;

  /**
   * i18n translation key for the short description (shown in the list view).
   */
  description: string;

  /**
   * i18n translation key for the extended dialog description.
   */
  dialogDescription: string;

  /**
   * Path to the project preview image (preferably .webp for performance).
   */
  image: string;

  /**
   * Array of icon paths to display in the list view.
   */
  icons: string[];

  /**
   * Array of icon paths to display in the dialog view (typically more detailed).
   */
  iconsDialoge: string[];

  /**
   * Optional GitHub repository URL for the project.
   */
  github?: string;

  /**
   * Optional live deployment URL for the project.
   */
  live?: string;

  /**
   * Optional internal key identifier (e.g. 'portfolio') for special handling.
   */
  key?: string;
}
