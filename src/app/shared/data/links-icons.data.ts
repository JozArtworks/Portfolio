export interface LinkIcon {
  name: string;
  icon: string;
  hoverIcon?: string;
  link?: string;
  altKey: string;
}


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
