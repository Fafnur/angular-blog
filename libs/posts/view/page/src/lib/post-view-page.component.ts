import { DatePipe, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Post } from '@angular-blog/posts/common';

import { SafeHtmlPipe } from './safe-html.pipe';

@Component({
  selector: 'angular-blog-post-view-page',
  templateUrl: './post-view-page.component.html',
  styleUrls: ['./post-view-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, DatePipe, SafeHtmlPipe],
})
export class PostViewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  post!: Post;

  listenClickFunc!: () => void;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    let route = this.activatedRoute.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.data['post']) {
      this.post = route.data['post'];
    }
  }

  ngOnDestroy() {
    if (this.listenClickFunc) {
      this.listenClickFunc();
    }
  }

  ngAfterViewInit() {
    const navigationElements = Array.prototype.slice.call(this.elementRef.nativeElement.querySelectorAll('a[routerLink]'));

    navigationElements.forEach((elem) => {
      this.listenClickFunc = this.renderer.listen(elem, 'click', (event) => {
        event.preventDefault();
        void this.router.navigate([elem.getAttribute('routerLink')]);
      });
    });
  }
}
