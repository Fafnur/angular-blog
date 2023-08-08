import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents, MockDirectives } from 'ng-mocks';

import { POST_STUB } from '@angular-blog/posts/common';
import { PostCardComponent } from '@angular-blog/posts/ui/card';
import { ColumnComponent, RowComponent, TabletDirective, WebDirective } from '@angular-blog/ui/grid';

import { PostListComponent } from './post-list.component';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostListComponent,
        CommonModule,
        MockComponents(PostCardComponent, ColumnComponent, RowComponent),
        MockDirectives(TabletDirective, WebDirective),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    component.posts = [POST_STUB];
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
