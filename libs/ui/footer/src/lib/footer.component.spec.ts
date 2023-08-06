import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents } from 'ng-mocks';

import { ContainerComponent } from '@angular-blog/ui/container';

import { CopyrightComponent } from './copyright/copyright.component';
import { FooterComponent } from './footer.component';
import { MarketsComponent } from './markets/markets.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, MockComponents(ContainerComponent, MarketsComponent, CopyrightComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
