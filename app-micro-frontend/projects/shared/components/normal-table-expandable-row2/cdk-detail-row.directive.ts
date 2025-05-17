import { Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Directive({
    selector: '[cdkDetailRow]',
    standalone: true
})
export class CdkDetailRowDirective {
  // Define private properties to store row, template, and open/close state
  private _row: any;
  private _templateRef: TemplateRef<any>;
  private _isOpen: boolean = false;
  // Define a property to store the previous view reference to ensure only one detail row is open at a time
  private _previousViewRef: any;

  // Use a HostBinding to add the 'expanded' class to the host element when the detail row is open
  @HostBinding('class.expanded')
  get expanded(): boolean {
    return this._isOpen;
  }

  // Define an Input to accept the row data
  @Input()
  set cdkDetailRow(value: any) {
    if (value !== this._row) {
      this._row = value;
    }
  }

  // Define an Input to accept the template for the detail row
  @Input('cdkDetailRowTpl')
  set template(value: TemplateRef<any>) {


    if (value !== this._templateRef) {


      this._templateRef = value;
    }
  }

  // Inject the ViewContainerRef to dynamically create views
  constructor(public viewContainerRef: ViewContainerRef) { }

  // Use a HostListener to listen for clicks on the host element
  @HostListener('click')
  onClick(): void {
    this.toggle();
  }

  // Define a toggle method to open or close the detail row
  toggle(): void {

    if (this._isOpen) {
      // If the detail row is open, clear the view and set the open state to false
      this.viewContainerRef.clear();
      this._isOpen = false;
    } else {
      // If the detail row is closed, clear the view and create an embedded view using the template and row data
      // Then set the open state to true and store the previous view reference
      if (this._previousViewRef) {
        this._previousViewRef.clear();
      }
      this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView(this._templateRef, { $implicit: this._row });
      this._isOpen = true;
      this._previousViewRef = this.viewContainerRef;
    }
  }
}
