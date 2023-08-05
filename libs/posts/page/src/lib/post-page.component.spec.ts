import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MockComponent, MockDirectives, MockModule } from 'ng-mocks';

import { ContainerComponent } from '@angular-blog/ui/container';
import { ColumnComponent, RowComponent, TabletDirective, WebDirective } from '@angular-blog/ui/grid';

import { PostPageComponent } from './post-page.component';

describe('PostPageComponent', () => {
  let component: PostPageComponent;
  let fixture: ComponentFixture<PostPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostPageComponent,
        MockComponent(ContainerComponent),
        MockComponent(RowComponent),
        MockComponent(ColumnComponent),
        MockModule(MatIconModule),
        MockDirectives(TabletDirective, WebDirective),
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
