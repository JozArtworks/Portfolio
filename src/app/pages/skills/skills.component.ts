import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
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
  { name: 'React', src: 'assets/icons/white/svg/logo_react.svg' },
  { name: 'Vue Js', src: 'assets/icons/white/svg/logo_vue.svg' },
];



  toolIcons = [
    { name: 'Firebase', src: 'assets/icons/white/svg/logo_firebase.svg' },
    { name: 'Angular', src: 'assets/icons/white/svg/logo_angular.svg' },
    { name: 'TypeScript', src: 'assets/icons/white/svg/logo_typescript.svg' },
    { name: 'CSS', src: 'assets/icons/white/svg/logo_css.svg' },
    { name: 'HTML', src: 'assets/icons/white/svg/logo_html.svg' },
    { name: 'Scrum', src: 'assets/icons/white/svg/logo_scrum.svg' },
    { name: 'API', src: 'assets/icons/white/svg/logo_api.svg' },
    { name: 'Git', src: 'assets/icons/white/svg/logo_git.svg' },
    { name: 'Material', src: 'assets/icons/white/svg/logo_material.svg' },
    { name: 'JavaScript', src: 'assets/icons/white/svg/logo_javascript.svg' },
    { name: 'school', src: 'assets/icons/white/svg/logo_learn.svg' },
    { name: 'OOP', src: 'assets/icons/white/svg/logo_oop.svg' },
  ];

  toolIconsDesign = [
    { name: '', src: 'assets/icons/white/svg/logo_figma.svg' },
    { name: '', src: 'assets/icons/white/svg/logo_photoshop.svg' },
    { name: '', src: 'assets/icons/white/svg/logo_illustrator.svg' },
    { name: '', src: 'assets/icons/white/svg/logo_indesign.svg' },
  ];

}

