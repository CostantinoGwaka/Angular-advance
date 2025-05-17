import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorExtractionService {
  constructor() {}

  getColors(image: HTMLImageElement, colorCount: number = 3): number[][] {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }

    const width = image.width;
    const height = image.height;
    canvas.width = width;
    canvas.height = height;

    context.drawImage(image, 0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const colorMap = new Map<string, number>();

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const colorKey = `${r},${g},${b}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }

    const sortedColors = Array.from(colorMap.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    const topColors = sortedColors
      .slice(0, colorCount)
      .map((color) => color[0].split(',').map(Number));

    return sortedColors
      .slice(0, colorCount)
      .map((color) => color[0].split(',').map(Number));
  }
}
