import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {
  toolsIcons, extraTools, toolsIconsDesign, ToolIcon
} from './../../shared/data/tools-icons.data';

/**
 * Displays categorized tool icons for development and design skills.
 *
 * This component supports:
 * - responsive behavior (mobile vs desktop),
 * - dynamic tooltips with translation,
 * - togglable extra tools via the "school" icon,
 * - keyboard accessibility and touch support,
 * - smooth scrolling to the contact section on user action.
 *
 * Icons and labels are defined in the external data file `tools-icons.data.ts`.
 */
@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})

export class SkillsComponent implements OnInit {

  /**
   * Observer for tracking the visibility of the `.tools-page` section.
   * Used to automatically close extra tools if the section leaves the viewport.
   */
  observer: IntersectionObserver | null = null;

  /** Tool icon groups (main, extra, design) */
  toolIcons = toolsIcons;
  extraTools = extraTools;
  toolIconsDesign = toolsIconsDesign;

  /** Whether the extra tools section is currently visible */
  showExtraTools = false;

  /** Tooltip text currently being shown (translated) */
  hoveredTooltipText = '';

  /** X/Y position of the cursor, used for positioning tooltips or special cursors */
  cursorX = 0;
  cursorY = 0;

  /** Whether the tooltip-triggering icon is hovered or touched */
  boxTouched = false;
  boxFocused = false;

  /** Flag for whether the special "question cursor" should be shown (for 'school' icon) */
  showQuestionCursor = false;

  /** Flag for detecting mobile viewports (>1000px = desktop) */
  isMobileView = false;

  constructor(private translate: TranslateService, private router: Router) { }

  /**
 * Initializes mobile view detection and registers a window resize listener.
 * Called automatically when the component is initialized.
 */
  ngOnInit(): void {
    this.isMobileView = window.innerWidth > 1000;
    window.addEventListener('resize', this.resizeListener);
  }

  /**
 * Cleans up the resize event listener and disconnects the IntersectionObserver.
 * Called automatically when the component is destroyed.
 */
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.observer?.disconnect();
  }

  /**
 * Updates the `isMobileView` flag based on the current window width.
 * Used internally in `ngOnInit` and on resize events.
 */
  private resizeListener = () => {
    this.isMobileView = window.innerWidth > 1000;
  };

  /**
 * Triggered when the user touches the "missing tools" box.
 * Sets internal flags used for touch behavior.
 */
  onBoxTouchStart(): void {
    this.boxFocused = true;
    this.boxTouched = true;
  }

  /**
 * Ends the touch interaction for the box.
 * Triggers visual feedback and initiates scroll to contact section.
 *
 * @param event Touch event triggered by the user
 */
  onBoxTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    const box = (event.currentTarget as HTMLElement);
    box.classList.add('touch-feedback');
    setTimeout(() => {
      box.classList.remove('touch-feedback');
    }, 100);
    this.scrollToContact(event);
  }

  /**
 * Handles click on a tool icon.
 * Toggles extra tools if the icon is the "school" icon.
 *
 * @param icon The clicked tool icon object
 */
  onIconClick(icon: ToolIcon): void {
    if (icon.name === 'school') {
      this.toggleExtraTools();
    }
  }

  /**
 * Toggles the visibility of the extra tools section.
 */
  toggleExtraTools(): void {
    this.showExtraTools = !this.showExtraTools;
  }

  /**
 * Handles keyboard interaction for icons.
 * Toggles extra tools if Enter or Space is pressed.
 *
 * @param event The keyboard event
 * @param icon The icon being focused
 */
  onKeyDown(event: KeyboardEvent, icon: ToolIcon): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onIconClick(icon);
      event.preventDefault();
    }
  }

  /**
 * Shows a translated tooltip when hovering over a tool icon.
 * Also sets the custom cursor state if the hovered icon is "school".
 *
 * @param MouseEvent triggered on hover
 * @param key Translation key for the tooltip
 * @param iconName Icon identifier (used for cursor logic)
 */
  onTooltipEnter(event: MouseEvent, key: string, iconName: string): void {
    this.hoveredTooltipText = this.translate.instant(key);
    this.showQuestionCursor = iconName === 'school';
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }

  /**
 * Hides the tooltip and resets cursor state.
 */
  onMouseLeaveTooltip(): void {
    this.hoveredTooltipText = '';
    this.showQuestionCursor = false;
  }

  /**
 * Smoothly scrolls to the contact section on the homepage.
 * Waits until the router finishes navigation before scrolling.
 *
 * @param event The triggering event (click, keydown, touch)
 */
  scrollToContact(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }

  /**
 * Handles keyboard interaction on the "scroll to contact" box.
 *
 * @param event Keyboard event (Enter or Space)
 */
  onBoxKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.scrollToContact(event);
      event.preventDefault();
    }
  }

}