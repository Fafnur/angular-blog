import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'backgroundImage',
  standalone: true,
})
export class BackgroundImagePipe implements PipeTransform {
  transform(image: string | null | undefined): object | null {
    return typeof image === 'string' && image.length ? { backgroundImage: `url(${image})` } : null;
  }
}
