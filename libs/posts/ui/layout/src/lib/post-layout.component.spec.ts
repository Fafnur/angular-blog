import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponents, MockDirectives, MockModule } from 'ng-mocks';

import { PostCategoriesComponent } from '@angular-blog/posts/ui/categories';
import { BreadcrumbsComponent } from '@angular-blog/ui/breadcrumbs';
import { ContainerComponent } from '@angular-blog/ui/container';
import { ColumnComponent, RowComponent, TabletDirective, WebDirective } from '@angular-blog/ui/grid';
import { TitleComponent } from '@angular-blog/ui/title';

import { PostLayoutComponent } from './post-layout.component';

describe('PostLayoutComponent', () => {
  let component: PostLayoutComponent;
  let fixture: ComponentFixture<PostLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostLayoutComponent,
        MockComponents(PostCategoriesComponent, BreadcrumbsComponent, RowComponent, ColumnComponent, TitleComponent, ContainerComponent),
        MockDirectives(TabletDirective, WebDirective),
        MockModule(MatIconModule),
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
