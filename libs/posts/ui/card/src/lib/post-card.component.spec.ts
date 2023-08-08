import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponents, MockDirective, MockModule, MockPipe } from 'ng-mocks';

import { ColumnComponent, RowComponent, TabletDirective } from '@angular-blog/ui/grid';

import { BackgroundImagePipe } from './background-image.pipe';
import { PostCardComponent } from './post-card.component';
import { POST_STUB } from '@angular-blog/posts/common';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostCardComponent,
        CommonModule,
        RouterTestingModule,
        MockModule(MatCardModule),
        MockModule(MatButtonModule),
        MockComponents(ColumnComponent, RowComponent),
        MockDirective(TabletDirective),
        MockPipe(BackgroundImagePipe),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
    component.post = POST_STUB;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
