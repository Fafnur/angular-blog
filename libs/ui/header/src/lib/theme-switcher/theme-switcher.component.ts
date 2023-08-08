import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { tap } from 'rxjs';

import { CookieService, WindowService } from '@angular-blog/core';

@Component({
  selector: 'angular-blog-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule],
})
export class ThemeSwitcherComponent implements OnInit {
  control!: FormControl<boolean>;
  isDark = true;

  constructor(
    private readonly platform: Platform,
    private readonly windowService: WindowService,
    private readonly cookieService: CookieService,
    private readonly destroyRef: DestroyRef,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  get mode(): string {
    return this.isDark ? 'dark' : 'light';
  }

  ngOnInit(): void {
    if (this.platform.isBrowser) {
      const prefers = this.windowService.window.matchMedia('(prefers-color-scheme: dark)').matches;
      const themePreference = this.cookieService.get('themePreference');

      this.isDark = themePreference ? themePreference === 'dark' : prefers ?? true;
      this.control = new FormControl<boolean>(this.isDark, { nonNullable: true });
      this.document.documentElement.setAttribute('data-theme', this.mode);

      this.control.valueChanges
        .pipe(
          tap((dark) => {
            this.isDark = dark;
            this.cookieService.set('themePreference', this.mode);
            this.document.documentElement.setAttribute('data-theme', this.mode);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  onToggle(): void {
    this.control.patchValue(!this.isDark);
  }
}
