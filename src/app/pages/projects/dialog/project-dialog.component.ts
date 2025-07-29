import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '../project.interface';
import { ProjectDialogService } from './../../../../assets/services/project-dialog.service';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss'],
})

export class ProjectDialogComponent {

  constructor(public dialog: ProjectDialogService) { }

  private previouslyFocusedElement: HTMLElement | null = null;

  ngAfterViewInit() {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    if (this.dialogRef?.nativeElement) {
      this.dialogRef.nativeElement.focus();
    }
  }

onClose() {
  const lastProject = this.dialog.currentProject(); // hole das aktuelle
  this.dialog.close(lastProject); // jetzt erlaubt
  if (this.previouslyFocusedElement) {
    this.previouslyFocusedElement.blur(); // optional
  }
}




  @ViewChild('dialogRef') dialogRef!: ElementRef;

  @Input() project!: Project;
  @Input() allProjects: Project[] = [];
  @Input() show = false;

  iconLeft = 'assets/icons/white/svg/icon_left_white.svg';
  iconRight = 'assets/icons/white/svg/icon_right_white.svg';
  iconClose = 'assets/icons/white/svg/icon_close_white.svg';

  isGitHovered = false;

  get currentIndex(): number {
    return this.dialog.allProjects().findIndex(p => p.title === this.project.title);
  }

  get isFirst(): boolean {
    return this.currentIndex === 0;
  }

  get isLast(): boolean {
    return this.currentIndex === this.dialog.allProjects().length - 1;
  }

previousProject() {
  if (!this.isFirst) {
    const prev = this.dialog.allProjects()[this.currentIndex - 1];
    this.dialog.change(prev);
    this.resetNavHoverIcons();
  }
}

nextProject() {
  if (!this.isLast) {
    const next = this.dialog.allProjects()[this.currentIndex + 1];
    this.dialog.change(next);
    this.resetNavHoverIcons();
  }
}

  onHoverClose(hovered: boolean) {
    this.iconClose = hovered
      ? 'assets/icons/green/svg/icon_close_green.svg'
      : 'assets/icons/white/svg/icon_close_white.svg';
  }

  onHoverLeft(hovered: boolean) {
    this.iconLeft = hovered
      ? 'assets/icons/green/svg/icon_left_green.svg'
      : 'assets/icons/white/svg/icon_left_white.svg';
  }

  @HostListener('window:keydown.arrowleft', ['$event'])

  onArrowLeft(event: KeyboardEvent) {
    if (!this.show) return;
    event.preventDefault();
    this.previousProject();
  }

  onHoverRight(hovered: boolean) {
    this.iconRight = hovered
      ? 'assets/icons/green/svg/icon_right_green.svg'
      : 'assets/icons/white/svg/icon_right_white.svg';
  }

  @HostListener('window:keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent) {
    if (!this.show) return;
    event.preventDefault();
    this.nextProject();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    this.onClose();
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  focusFirst() {
    const focusable = this.getFocusableElements();
    focusable[0]?.focus();
  }

  focusLast() {
    const focusable = this.getFocusableElements();
    focusable[focusable.length - 1]?.focus();
  }

  private getFocusableElements(): HTMLElement[] {
    const dialog = this.dialogRef?.nativeElement as HTMLElement;
    if (!dialog) return [];
    return Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    ));
  }

  private resetNavHoverIcons() {
  this.iconLeft = 'assets/icons/white/svg/icon_left_white.svg';
  this.iconRight = 'assets/icons/white/svg/icon_right_white.svg';
}


}
