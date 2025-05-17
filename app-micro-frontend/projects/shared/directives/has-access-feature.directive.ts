import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Directive({
  selector: '[appHasAccessFeature]',
  standalone: true
})
export class HasAccessFeatureDirective {

  private accessFeatures: any = '';
  private rendered = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  @Input()
  set appHasAccessFeature(val: string | string[] | undefined) {
    this.accessFeatures = val;
    this.updateView();
  }

  private updateView() {
    if (!this.rendered) {
      if (this.authService.hasAccessFeatures(this.accessFeatures)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.rendered = true;
      } else {
        this.viewContainer.clear();
      }
    }
  }

}
