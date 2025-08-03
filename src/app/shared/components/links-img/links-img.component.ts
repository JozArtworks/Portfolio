import { Component, Output, Input, EventEmitter } from '@angular/core';
import { linksIcons, LinkIcon } from '../../../shared/data/links-icons.data';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

/**
 * @component LinksImgComponent
 *
 * Renders a row of interactive icon buttons, such as social media links or mail action.
 * Icons can display tooltips on hover, support keyboard navigation,
 * and trigger custom logic like copying the email address.
 *
 * The component is context-aware and adapts tooltip behavior and layout
 * depending on its placement (`landing`, `navbar`, or `footer`).
 *
 * @example
 * <app-links-img
 *   [context]="'footer'"
 *   [isEmailVisible]="showEmail()"
 *   [showCopyDialog]="showCopyDialog()"
 *   (mailClicked)="toggleEmail()"
 * />
 */
@Component({
  selector: 'app-links-img',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './links-img.component.html',
  styleUrl: './links-img.component.scss'
})
export class LinksImgComponent {

  /**
   * Layout context in which the component is rendered.
   * Affects tooltip position and styling.
   *
   * @default 'landing'
   */
  @Input() context: 'landing' | 'footer' | 'navbar' = 'landing';

  /**
   * Whether the email toast is currently visible.
   * Used to update the mail icon appearance and disable tooltip.
   */
  @Input() isEmailVisible = false;

  /**
   * Whether the copy dialog (after clicking mail) is currently shown.
   * Used to disable tooltip display while dialog is active.
   */
  @Input() showCopyDialog = false;

  /**
   * Emits when the Mail icon is clicked.
   * Used to toggle the email toast from the parent component.
   */
  @Output() mailClicked = new EventEmitter<void>();

  /**
   * Internally tracked name of the currently hovered icon.
   * Used to trigger alternate icon versions on hover.
   */
  hoveredIconName = '';

  /**
   * List of icons to render, including their name, icon paths and optional hover variant.
   */
  linksIcons: LinkIcon[] = linksIcons;

  /**
   * Sets the currently hovered icon name.
   * Called on mouseenter of each icon.
   */
  setHoveredIcon(name: string): void {
    this.hoveredIconName = name;
  }

  /**
   * Clears the hovered icon state.
   * Called on mouseleave.
   */
  clearHoveredIcon(): void {
    this.hoveredIconName = '';
  }

  /**
   * Returns the icon source depending on hover or mail state.
   * If hovered or active mail, returns `hoverIcon` if available, else normal icon.
   */
  getIconSrc(icon: LinkIcon): string {
    const isHovered = this.hoveredIconName === icon.name;
    const isActiveMail = icon.name === 'Mail' && this.isEmailVisible;
    return isHovered || isActiveMail ? icon.hoverIcon || icon.icon : icon.icon;
  }

  /**
   * Handles icon click behavior.
   * Emits `mailClicked` if the Mail icon was clicked.
   */
  handleIconClick(iconName: string): void {
    if (iconName === 'Mail') {
      this.mailClicked.emit();
    }
    this.clearHoveredIcon();
  }

}
