import { DatePipe, NgIf } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPipe } from 'ng-mocks';

import { POST_STUB } from '@angular-blog/posts/common';

import { PostViewPageComponent } from './post-view-page.component';
import { SafeHtmlPipe } from './safe-html.pipe';

describe('PostViewPageComponent', () => {
  let component: PostViewPageComponent;
  let fixture: ComponentFixture<PostViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostViewPageComponent, DatePipe, NgIf, MockPipe(SafeHtmlPipe), RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                post: POST_STUB,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostViewPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
