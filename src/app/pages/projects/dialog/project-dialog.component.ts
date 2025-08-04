import { Component, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '../project.interface';
import { ProjectDialogService } from '../../../shared/services/project-dialog.service';

/**
 * A modal dialog component to display detailed information about a selected project.
 *
 * Includes keyboard navigation, focus management, accessibility support,
 * swipe gesture handling (mobile), and conditional navigation between multiple projects.
 */
@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss'],
})

export class ProjectDialogComponent {

  /**
   * Stores the element that was focused before the dialog opened.
   *
   * Used to return focus to the previously active element when the dialog closes,
   * ensuring accessibility and logical keyboard navigation.
   */
  private previouslyFocusedElement: HTMLElement | null = null;

  /** X-axis start position of touch gesture */
  touchStartX = 0;

  /** Current X translation of the dragged dialog */
  currentTranslateX = 0;

  /** Whether a swipe gesture is currently in progress */
  dragging = false;

  /** Direction of swipe animation: 'left', 'right' or null */
  swipeDirection: 'left' | 'right' | null = null;

  /** Direction of entry animation after swipe navigation */
  enterDirection: 'left' | 'right' | null = null;

  /** Left navigation icon (changes on hover) */
  iconLeft = 'assets/icons/white/svg/icon_left_white.svg';

  /** Right navigation icon (changes on hover) */
  iconRight = 'assets/icons/white/svg/icon_right_white.svg';

  /** Close icon (changes on hover) */
  iconClose = 'assets/icons/white/svg/icon_close_white.svg';

  /** Whether the GitHub button is hovered */
  isGitHovered = false;

  /** Whether the GitHub button is focused */
  isGitFocused = false;

  /** Reference to the dialog container for focus and swipe logic */
  @ViewChild('dialogRef') dialogRef!: ElementRef;

  /** The currently displayed project */
  @Input() project!: Project;

  /** All available projects for navigation */
  @Input() allProjects: Project[] = [];

  /** Whether the dialog is currently visible */
  @Input() show = false;

  constructor(public dialog: ProjectDialogService) { }

  /**
   * Sets initial focus when the dialog is opened and stores the previously focused element.
   */
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

  /**
   * Restores the focus to the previously focused element and unlocks body scroll on destroy.
   */
  ngOnDestroy() {
    document.body.style.overflow = 'auto';
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  /**
   * Closes the dialog and restores focus.
   */
  onClose() {
    const lastProject = this.dialog.currentProject();
    this.dialog.close(lastProject);
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.blur();
    }
  }

  /**
   * Navigates to the previous project.
   */
  previousProject() {
    if (!this.isFirst) {
      const prev = this.dialog.allProjects()[this.currentIndex - 1];
      this.dialog.change(prev);
      this.resetNavHoverIcons();
    }
  }

  /**
   * Navigates to the next project.
   */
  nextProject() {
    if (!this.isLast) {
      const next = this.dialog.allProjects()[this.currentIndex + 1];
      this.dialog.change(next);
      this.resetNavHoverIcons();
    }
  }

  /**
   * Updates the close icon on hover.
   */
  onHoverClose(hovered: boolean) {
    this.iconClose = hovered
      ? 'assets/icons/green/svg/icon_close_green.svg'
      : 'assets/icons/white/svg/icon_close_white.svg';
  }

  /**
   * Updates the left navigation icon on hover.
   */
  onHoverLeft(hovered: boolean) {
    this.iconLeft = hovered
      ? 'assets/icons/green/svg/icon_left_green.svg'
      : 'assets/icons/white/svg/icon_left_white.svg';
  }

  /**
   * Updates the right navigation icon on hover.
   */
  onHoverRight(hovered: boolean) {
    this.iconRight = hovered
      ? 'assets/icons/green/svg/icon_right_green.svg'
      : 'assets/icons/white/svg/icon_right_white.svg';
  }

  /**
   * Moves focus to the first focusable element inside the dialog.
   */
  focusFirst() {
    const focusable = this.getFocusableElements();
    focusable[0]?.focus();
  }

  /**
   * Moves focus to the last focusable element inside the dialog.
   */
  focusLast() {
    const focusable = this.getFocusableElements();
    focusable[focusable.length - 1]?.focus();
  }

  /**
   * Stores the initial touch position on mobile for swipe gesture detection.
   */
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.dragging = true;
  }

  /**
   * Updates the horizontal translation of the dialog during swipe gesture.
   */
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

  /**
   * Handles the end of a touch gesture by evaluating the swipe distance
   * and triggering the appropriate navigation or reset behavior.
   */
  onTouchEnd() {
    this.dragging = false;
    const threshold = 80;
    const box = this.dialogRef.nativeElement.querySelector('.box') as HTMLElement;
    if (this.currentTranslateX < -threshold && !this.isLast) {
      this.handleSwipeLeft(box);
    } else if (this.currentTranslateX > threshold && !this.isFirst) {
      this.handleSwipeRight(box);
    } else {
      this.resetDraggedBox(box);
    }
    this.currentTranslateX = 0;
  }

  /**
   * Handles swipe-left behavior: navigates to the next project with animation
   * and sets entry direction for slide-in effect.
   *
   * @param box - The dialog box element being swiped
   */
  private handleSwipeLeft(box: HTMLElement): void {
    this.currentTranslateX = 0;
    box.style.transform = '';
    this.swipeDirection = 'left';
    setTimeout(() => {
      this.nextProject();
      this.swipeDirection = null;
      this.enterDirection = 'right';
      setTimeout(() => this.enterDirection = null, 300);
    }, 250);
  }

  /**
   * Handles swipe-right behavior: navigates to the previous project with animation
   * and sets entry direction for slide-in effect.
   *
   * @param box - The dialog box element being swiped
   */
  private handleSwipeRight(box: HTMLElement): void {
    this.currentTranslateX = 0;
    box.style.transform = '';
    this.swipeDirection = 'right';
    setTimeout(() => {
      this.previousProject();
      this.swipeDirection = null;
      this.enterDirection = 'left';
      setTimeout(() => this.enterDirection = null, 300);
    }, 250);
  }

  /**
   * Resets the dialog box position and applies a rebound animation
   * if the swipe was too short to trigger navigation.
   *
   * @param box - The dialog box element to reset
   */
  private resetDraggedBox(box: HTMLElement): void {
    if (!box) return;
    box.classList.add('rebound');
    box.style.transform = `translateX(0)`;
  }

  /**
   * Index of the currently displayed project in the `allProjects` array.
   */
  get currentIndex(): number {
    return this.dialog.allProjects().findIndex(p => p.title === this.project.title);
  }

  /**
   * Whether the current project is the first in the list.
   */
  get isFirst(): boolean {
    return this.currentIndex === 0;
  }

  /**
   * Whether the current project is the last in the list.
   */
  get isLast(): boolean {
    return this.currentIndex === this.dialog.allProjects().length - 1;
  }

  /**
   * Handles keyboard navigation to previous project with ArrowLeft.
   */
  @HostListener('window:keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent) {
    if (!this.show) return;
    event.preventDefault();
    this.previousProject();
  }

  /**
   * Handles keyboard navigation to next project with ArrowRight.
   */
  @HostListener('window:keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent) {
    if (!this.show) return;
    event.preventDefault();
    this.nextProject();
  }

  /**
   * Handles closing the dialog when Escape is pressed.
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    this.onClose();
  }

  /**
   * Returns a list of all focusable elements inside the dialog.
   */
  private getFocusableElements(): HTMLElement[] {
    const dialog = this.dialogRef?.nativeElement as HTMLElement;
    if (!dialog) return [];
    return Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    ));
  }

  /**
   * Resets the navigation icons to their default (white) state.
   */
  private resetNavHoverIcons() {
    this.iconLeft = 'assets/icons/white/svg/icon_left_white.svg';
    this.iconRight = 'assets/icons/white/svg/icon_right_white.svg';
  }
}