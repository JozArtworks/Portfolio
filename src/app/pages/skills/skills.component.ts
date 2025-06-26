import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {

  toolIcons = [
  { name: 'Angular', src: 'assets/icons/white/angular_white.png' },
  { name: 'TypeScript', src: 'assets/icons/white/typescript_white.png' },
  { name: 'JavaScript', src: 'assets/icons/white/javascript_white.png' },
  { name: 'HTML', src: 'assets/icons/white/html_white.png' },
  { name: 'CSS', src: 'assets/icons/white/css_white.png' },
  { name: 'API', src: 'assets/icons/white/api_white.png' },
  { name: 'Material', src: 'assets/icons/white/material_white.png' },
  { name: 'Firebase', src: 'assets/icons/white/firebase_white.png' },
  { name: 'OOP', src: 'assets/icons/white/oop_white.png' },
  { name: 'Git', src: 'assets/icons/white/git_white.png' },
  { name: 'Scrum', src: 'assets/icons/white/scrum_white.png' },
  { name: 'React', src: 'assets/icons/colors/react_icon_color.png' },
  { name: 'Vue', src: 'assets/icons/colors/vue_icon_color.png' },
];

toolIconsDesign = [
  { name: 'Figma', src: 'assets/icons/white/figame_white.png' },
  { name: 'Photoshop', src: 'assets/icons/white/ps_white.png' },
  { name: 'Illustrator', src: 'assets/icons/white/ai_white.png' },
  { name: 'Indesign', src: 'assets/icons/white/id_white.png' },
];

}
