import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MockComponent, MockModule } from 'ng-mocks';

import { CategoriesComponent } from '@angular-blog/ui/categories';

import { PostCategoriesComponent } from './post-categories.component';

describe('PostCategoriesComponent', () => {
  let component: PostCategoriesComponent;
  let fixture: ComponentFixture<PostCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCategoriesComponent, MockModule(MatCardModule), MockComponent(CategoriesComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCategoriesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
