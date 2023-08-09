import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MockModule } from 'ng-mocks';

import { IconService } from '@angular-blog/core';

import { MarketsComponent } from './markets.component';

describe('MarketsComponent', () => {
  let component: MarketsComponent;
  let fixture: ComponentFixture<MarketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketsComponent, MockModule(MatIconModule)],
      providers: [
        {
          provide: IconService,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            add: (name: string, source: string) => undefined,
          } as IconService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
