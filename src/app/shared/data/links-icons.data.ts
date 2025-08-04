/**
 * Represents an icon element used for external links (e.g., GitHub, LinkedIn, Email).
 * Used in footer, navbar and landing page to display consistent social/media icons.
 */
export interface LinkIcon {
  /**
   * Display name of the icon (for identification, not shown in UI).
   */
  name: string;

  /**
   * Path to the default icon SVG.
   */
  icon: string;

  /**
   * Optional path to the hover state icon SVG.
   */
  hoverIcon?: string;

  /**
   * Optional external URL the icon links to (mailto, LinkedIn, GitHub, etc.).
   */
  link?: string;

  /**
   * Translation key used for the `alt` attribute (accessibility / screenreader).
   */
  altKey: string;
}

/**
 * Static array of link icons used across the portfolio (landing, navbar, footer).
 * Includes icon paths, alt translation keys and optional links.
 */
export const linksIcons: LinkIcon[] = [
  {
    name: 'GitHub',
    icon: 'assets/icons/white/svg/logo_github_white.svg',
    hoverIcon: 'assets/icons/green/svg/logo_github_green.svg',
    link: 'https://github.com/JozArtworks',
    altKey: 'links.github'
  },
  {
    name: 'Mail',
    icon: 'assets/icons/white/svg/logo_email.svg',
    hoverIcon: 'assets/icons/green/svg/logo_email_green.svg',
    altKey: 'links.mail'
  },
  {
    name: 'Linkedin',
    icon: 'assets/icons/white/svg/logo_linkedin.svg',
    hoverIcon: 'assets/icons/green/svg/logo_linkedin_green.svg',
    link: 'https://www.linkedin.com/in/jonathan-michutta-527722210/',
    altKey: 'links.linkedin'
  },
];
