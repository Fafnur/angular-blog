import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { MockModule } from 'ng-mocks';

import { PostPaginationComponent } from './post-pagination.component';

describe('PostPaginationComponent', () => {
  let component: PostPaginationComponent;
  let fixture: ComponentFixture<PostPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPaginationComponent, CommonModule, RouterTestingModule, MockModule(MatButtonModule)],
    }).compileComponents();

    fixture = TestBed.createComponent(PostPaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
