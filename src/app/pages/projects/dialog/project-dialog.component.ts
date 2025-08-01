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
      setTimeout(() => {
        this.dialogRef?.nativeElement?.focus();

        const box = this.dialogRef.nativeElement.querySelector('.box') as HTMLElement;
        if (box) {
          box.style.transform = '';
          box.classList.remove('rebound');
        }
      }, 0);
    }
  }


  onClose() {
    const lastProject = this.dialog.currentProject();
    this.dialog.close(lastProject);
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.blur();
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
  isGitFocused = false;

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

  private touchEndX = 0;
  swipeDirection: 'left' | 'right' | null = null;
  enterDirection: 'left' | 'right' | null = null;

  private handleSwipeGesture() {
    const swipeDistance = this.touchEndX - this.touchStartX;
    if (Math.abs(swipeDistance) < 50) return;
    if (swipeDistance < 0 && !this.isLast) {
      this.swipeDirection = 'left';
      setTimeout(() => {
        this.nextProject();
        this.swipeDirection = null;
        this.enterDirection = 'right';
        setTimeout(() => this.enterDirection = null, 150);
      }, 250);
    } else if (swipeDistance > 0 && !this.isFirst) {
      this.swipeDirection = 'right';
      setTimeout(() => {
        this.previousProject();
        this.swipeDirection = null;
        this.enterDirection = 'left';
        setTimeout(() => this.enterDirection = null, 150);
      }, 250);
    }
  }

  touchStartX = 0;
  currentTranslateX = 0;
  dragging = false;

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.dragging = true;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.dragging) return;
    const currentX = event.touches[0].clientX;
    this.currentTranslateX = currentX - this.touchStartX;
    const box = this.dialogRef.nativeElement.querySelector('.box') as HTMLElement;
    if (box) {
      box.style.transform = `translateX(${this.currentTranslateX}px)`;
      box.classList.remove('rebound');
    }
  }

  onTouchEnd() {
    this.dragging = false;
    const threshold = 80;
    const box = this.dialogRef.nativeElement.querySelector('.box') as HTMLElement;
    if (this.currentTranslateX < -threshold && !this.isLast) {
      this.currentTranslateX = 0;
      box.style.transform = '';
      this.swipeDirection = 'left';
      setTimeout(() => {
        this.nextProject();
        this.swipeDirection = null;
        this.enterDirection = 'right';
        setTimeout(() => this.enterDirection = null, 300);
      }, 250);
    } else if (this.currentTranslateX > threshold && !this.isFirst) {
      this.currentTranslateX = 0;
      box.style.transform = '';
      this.swipeDirection = 'right';
      setTimeout(() => {
        this.previousProject();
        this.swipeDirection = null;
        this.enterDirection = 'left';
        setTimeout(() => this.enterDirection = null, 300);
      }, 250);
    } else {
      if (box) {
        box.classList.add('rebound');
        box.style.transform = `translateX(0)`;
      }
    }
    this.currentTranslateX = 0;
  }

}
