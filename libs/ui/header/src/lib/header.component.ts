import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ContainerComponent } from '@angular-blog/ui/container';

import { AboutComponent } from './about/about.component';
import { GithubComponent } from './github/github.component';
import { LogoComponent } from './logo/logo.component';
import { MenuComponent } from './menu/menu.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';

@Component({
  selector: 'angular-blog-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbarModule, ThemeSwitcherComponent, ContainerComponent, LogoComponent, MenuComponent, AboutComponent, GithubComponent],
})
export class HeaderComponent {}
