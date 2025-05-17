import { Pipe, PipeTransform } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Pipe({
    name: 'unicodeToEmoji',
    standalone: true
})
export class UnicodeToEmojiPipe implements PipeTransform {

  transform(unicode: string): string {
    if (!unicode) return ''; // Handle empty or null input

    // Convert the Unicode escape sequence to an emoji
    const emoji = String.fromCodePoint(parseInt(unicode.replace(/U\+/g, ''), 16));

    return emoji;
  }

}
