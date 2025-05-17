import { Directive, ElementRef, HostListener } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Directive({
    selector: '[disableTypingInsideConditionBlock]',
    standalone: true,
})
export class DisableTypingInsideConditionBlockDirective {
  constructor(private elementRef: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const isCursorInsideBlock = this.isCursorInsideBlock(target);

    if (isCursorInsideBlock) {
      event.preventDefault();
    }
  }

  private isCursorInsideBlock(target: HTMLElement): boolean {
    const blockElements = this.elementRef.nativeElement.querySelectorAll(
      'template_condition_block'
    );
    const selection = window.getSelection();

    for (let i = 0; i < blockElements.length; i++) {
      if (selection?.containsNode(blockElements[i], true)) {
        return true;
      }
    }

    return false;
  }
}
