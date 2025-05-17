import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BlockingProgressLoaderService {
  progress = signal<number>(0);
}
