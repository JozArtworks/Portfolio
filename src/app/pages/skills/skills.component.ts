import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  toolsIcons,
  extraTools,
  toolsIconsDesign,
  ToolIcon
} from './../../shared/data/tools-icons.data';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {

  observer: IntersectionObserver | null = null;

  toolIcons = toolsIcons;
  extraTools = extraTools;
  toolIconsDesign = toolsIconsDesign;
  showExtraTools = false;
  hoveredTooltipText = '';
  tooltipX = 0;
  tooltipY = 0;

  constructor(private translate: TranslateService) { }

  isMobileView = false;

  ngAfterViewInit(): void {
    const toolsSection = document.querySelector('.tools-page');
    if (toolsSection) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && this.showExtraTools) {
              this.showExtraTools = false;
            }
          });
        },
        { threshold: 0.1 }
      );
      this.observer.observe(toolsSection);
    }
  }


  ngOnInit(): void {
    this.isMobileView = window.innerWidth > 1000;
    window.addEventListener('resize', () => {
      this.isMobileView = window.innerWidth > 1000;
    });
  }

  onIconClick(icon: ToolIcon): void {
    if (icon.name === 'school') {
      this.toggleExtraTools();
    }
  }

  toggleExtraTools(): void {
    this.showExtraTools = !this.showExtraTools;
  }

  onKeyDown(event: KeyboardEvent, icon: ToolIcon): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onIconClick(icon);
      event.preventDefault();
    }
  }

  cursorX = 0;
  cursorY = 0;
  showQuestionCursor = false;

  onTooltipEnter(event: MouseEvent, key: string, iconName: string): void {
    this.hoveredTooltipText = this.translate.instant(key);
    this.showQuestionCursor = iconName === 'school';
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.showQuestionCursor) {
      this.cursorX = event.clientX + 20;
      this.cursorY = event.clientY - 20;
    }
  }

  onMouseLeaveTooltip(): void {
    this.hoveredTooltipText = '';
    this.showQuestionCursor = false;
  }



}