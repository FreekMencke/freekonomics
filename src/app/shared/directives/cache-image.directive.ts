import { HttpClient } from '@angular/common/http';
import { Directive, ElementRef, Injectable, Input, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
class CacheImageService {
  imageRequests$: Map<string, Observable<string>> = new Map();
}

@Directive({
  selector: 'img[src]',
})
export class CacheImageDirective implements OnInit {
  private readonly EMPTY_IMAGE_OBJECT_URL: string =
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

  @Input() src: string;

  constructor(private el: ElementRef, private cacheImageService: CacheImageService, private http: HttpClient) {}

  ngOnInit(): void {
    // Start with empy image to prevent missing image/alt flashing
    this.el.nativeElement.src = this.EMPTY_IMAGE_OBJECT_URL;

    this.loadImage(this.src).subscribe((objectUrl) => (this.el.nativeElement.src = objectUrl));
  }

  loadImage(src: string): Observable<string> {
    if (this.cacheImageService.imageRequests$.has(src)) return this.cacheImageService.imageRequests$.get(src)!;

    const obs$ = this.http.get(src, { responseType: 'arraybuffer' }).pipe(
      map((arrayBuffer) => URL.createObjectURL(new Blob([arrayBuffer]))),
      shareReplay(1),
    );

    this.cacheImageService.imageRequests$.set(src, obs$);

    return obs$;
  }
}
