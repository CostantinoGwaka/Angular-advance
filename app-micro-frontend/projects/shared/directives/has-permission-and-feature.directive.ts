import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Directive({
  selector: '[appHasPermissionAndFeature]',
  standalone: true
})
export class HasPermissionAndFeatureDirective {
  @Input() set appHasPermissionAndFeature(menu: any) {
    const hasPermission = this.authService.hasPermission(menu.authority);
    const hasFeatureAccess = this.hasAccessToFeatures(menu.feature);

    if (hasPermission && hasFeatureAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private hasAccessToFeatures(features: any[]): boolean {
    if (!features || features.length === 0) {
      return true;  // If no features exist, skip the feature access check
    }
    // If features exist, check if the user has access to any of them
    return features.some((feature) => this.authService.hasAccessFeatures(feature.key));
  }

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }
}
