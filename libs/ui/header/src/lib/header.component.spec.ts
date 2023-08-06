import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MockComponents, MockModule } from 'ng-mocks';

import { WindowService } from '@angular-blog/core';

import { HeaderComponent } from './header.component';
import { MenuComponent } from './menu/menu.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        MockComponents(MenuComponent),
        MockModule(MatToolbarModule),
        MockModule(MatIconModule),
        MockModule(MatButtonModule),
      ],
      providers: [
        {
          provide: WindowService,
          useValue: {
            window: {
              localStorage: { getItem: () => null, setItem: () => undefined },
              matchMedia: () => ({ matches: true }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
