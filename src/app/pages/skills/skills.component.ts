import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  toolsIcons,
  extraTools,
  toolsIconsDesign,
} from './../../shared/data/tools-icons.data';
@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {

  showExtraTools = false;

  toolIcons = toolsIcons;
  extraTools = extraTools;
  toolIconsDesign = toolsIconsDesign;

  onIconClick(icon: any) {
    if (icon.name === 'school') {
      this.toggleExtraTools();
    }
  }

  toggleExtraTools() {
    this.showExtraTools = !this.showExtraTools;
  }

  onKeyDown(event: KeyboardEvent, icon: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onIconClick(icon);
      event.preventDefault();
    }
  }

}
