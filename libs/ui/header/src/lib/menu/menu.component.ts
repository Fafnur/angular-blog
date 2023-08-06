import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CategoriesComponent } from '@angular-blog/ui/categories';

@Component({
  selector: 'angular-blog-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatSidenavModule, CategoriesComponent],
})
export class MenuComponent {}
