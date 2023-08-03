import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { tap } from 'rxjs';

import { WindowService } from '@angular-blog/core';

@Component({
  selector: 'angular-blog-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
})
export class HeaderComponent implements OnInit {
  control!: FormControl<boolean>;
  isDark = true;

  constructor(
    private readonly platform: Platform,
    private readonly windowService: WindowService,
    private readonly destroyRef: DestroyRef,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngOnInit(): void {
    if (this.platform.isBrowser) {
      const prefers = this.windowService.window.matchMedia('(prefers-color-scheme: dark)').matches;
      const themePreference = this.windowService.window.localStorage.getItem('themePreference');

      this.isDark = themePreference ? themePreference === 'true' : prefers ?? true;
      this.control = new FormControl<boolean>(this.isDark, { nonNullable: true });
      this.document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');

      this.control.valueChanges
        .pipe(
          tap((dark) => {
            this.isDark = dark;
            this.windowService.window.localStorage.setItem('themePreference', dark.toString());
            this.document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    } else {
      this.document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
    }
  }

  onSwitchMode(isDark: boolean): void {
    this.control.patchValue(isDark);
  }
}
