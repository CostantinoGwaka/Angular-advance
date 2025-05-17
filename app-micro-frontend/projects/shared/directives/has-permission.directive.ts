import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { AuthService } from "../../services/auth.service";

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {

  private permissions: any = '';
  private rendered = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  @Input()
  set appHasPermission(val: string | string[] | undefined) {
    this.permissions = val;
    this.updateView();
  }

  private updateView() {
    if (!this.rendered) {
      if (this.authService.hasPermission(this.permissions)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.rendered = true;
      } else {
        this.viewContainer.clear();
      }
    }
  }

}
