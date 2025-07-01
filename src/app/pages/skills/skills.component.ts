import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {

showExtraTools = false;

onIconClick(icon: any) {
  if (icon.name === 'school') {
    this.toggleExtraTools();
  }
}

toggleExtraTools() {
  this.showExtraTools = !this.showExtraTools;
}

extraTools = [
  { name: 'React', src: 'assets/icons/colors/react_icon_color.png' },
  { name: 'Vue', src: 'assets/icons/colors/vue_icon_color.png' },
];


  toolIcons = [
    { name: 'Firebase', src: 'assets/icons/white/firebase_white.png' },
    { name: 'Angular', src: 'assets/icons/white/angular_white.png' },
    { name: 'TypeScript', src: 'assets/icons/white/typescript_white.png' },
    { name: 'CSS', src: 'assets/icons/white/css_white.png' },
    { name: 'HTML', src: 'assets/icons/white/html_white.png' },
    { name: 'Scrum', src: 'assets/icons/white/scrum_white.png' },
    { name: 'API', src: 'assets/icons/white/api_white.png' },
    { name: 'Git', src: 'assets/icons/white/git_white.png' },
    { name: 'Material', src: 'assets/icons/white/material_white.png' },
    { name: 'JavaScript', src: 'assets/icons/white/javascript_white.png' },
    { name: 'school', src: 'assets/icons/green/school_green.png' },
    { name: 'OOP', src: 'assets/icons/white/oop_white.png' },
  ];

  toolIconsDesign = [
    { name: '', src: 'assets/icons/white/ps_white.png' },
    { name: '', src: 'assets/icons/white/ai_white.png' },
    { name: '', src: 'assets/icons/white/id_white.png' },
    { name: '', src: 'assets/icons/white/figame_white.png' },
  ];

}

