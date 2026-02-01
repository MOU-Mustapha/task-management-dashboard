import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TasksFacade } from '../../../features/tasks/services/tasks.facade';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopoverModule } from 'primeng/popover';

/**
 * Application header component.
 *
 * Responsibilities:
 * - Handles language switching (i18n + layout direction)
 * - Updates global document attributes (lang, dir, body classes)
 * - Dispatches task search queries and redirects to tasks page if needed
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-header',
  imports: [TranslateModule, FormsModule, PopoverModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly translateService = inject(TranslateService);
  private readonly tasksFacade = inject(TasksFacade);
  private readonly router = inject(Router);
  /**
   * Toggles application language between English and Arabic.
   *
   * Side effects:
   * - Persists selected language in localStorage
   * - Updates ngx-translate active language
   * - Toggles body CSS classes (en / ar)
   * - Updates document direction (ltr / rtl)
   * - Updates document and body lang attributes for accessibility
   */
  toggleLang() {
    const nextLang = this.translateService.getCurrentLang() === 'en' ? 'ar' : 'en';
    localStorage.setItem('lang', nextLang);
    this.translateService.use(nextLang);
    const isEnglish = nextLang === 'en';
    document.body.classList.toggle('en', isEnglish);
    document.body.classList.toggle('ar', !isEnglish);
    document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
    document.documentElement.lang = nextLang;
    document.body.lang = nextLang;
  }
  /**
   * Updates the task search term and navigates to the tasks page if not already there.
   */
  onSearch(value: string) {
    this.tasksFacade.setSearch(value);
    if (!this.router.url.includes('/tasks')) this.router.navigate(['/tasks']);
  }
}
