import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponents, MockDirectives, MockModule } from 'ng-mocks';

import { POST_STUB } from '@angular-blog/posts/common';
import { ContainerComponent } from '@angular-blog/ui/container';
import { ColumnComponent, RowComponent, TabletDirective, WebDirective } from '@angular-blog/ui/grid';
import { TitleComponent } from '@angular-blog/ui/title';

import { PostPageComponent } from './post-page.component';

describe('PostPageComponent', () => {
  let component: PostPageComponent;
  let fixture: ComponentFixture<PostPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostPageComponent,
        RouterTestingModule,
        MockComponents(ContainerComponent, RowComponent, ColumnComponent, TitleComponent),
        MockModule(MatIconModule),
        MockDirectives(TabletDirective, WebDirective),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                posts: [POST_STUB],
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
