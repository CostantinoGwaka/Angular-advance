import {
  computed,
  Injectable,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';

export interface SingleLoaderItem {
  id: string;
  title: string;
  progress: number;
  progressColor?: string;
  hasError?: boolean;
  bold?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class MultiLoaderService implements OnInit {
  loadingItems: WritableSignal<SingleLoaderItem[]> = signal([]);

  hasItems = computed(() => {
    return this.loadingItems()?.length > 0;
  });

  constructor() {}

  ngOnInit(): void {
    this.resetAll();
  }

  resetAll() {
    this.loadingItems.update(() => []);
  }

  addLoadingItem(item: SingleLoaderItem) {
    this.loadingItems.update((items) => [...items, item]);
  }

  removeFinishedItem(id: string) {
    this.loadingItems?.update((items) =>
      items.filter((item) => item.id !== id)
    );
  }

  updateTitle(id: string, title: string) {
    this.loadingItems.update((items) => {
      const item = items.find((item) => item.id === id);
      if (item) {
        item.title = title;
      }
      return [...items];
    });
  }

  updateProgress(id: string, progress: number) {
    this.loadingItems.update((items) => {
      const item = items.find((item) => item.id === id);
      if (item) {
        item.progress = progress;
      }
      if (progress >= 100) {
        setTimeout(() => {
          this.removeFinishedItem(id);
        }, 500);
      }
      return [...items];
    });
  }
}
